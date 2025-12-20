const SessionRequest = require("../models/SessionRequest");
const User = require("../models/User");


const sendRequest = async (req, res) => {
  const { receiverId, skillRequested } = req.body;

  try {
    if (receiverId === req.user.id) {
      return res
        .status(400)
        .json({ message: "Cannot send request to yourself" });
    }

    const sender = await User.findById(req.user.id);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    const existing = await SessionRequest.findOne({
      sender: sender._id,
      receiver: receiver._id,
      skillRequested,
      status: "pending",
    });

    if (existing) {
      return res.status(400).json({ message: "Request already sent" });
    }

    const newRequest = new SessionRequest({
      sender: sender._id,
      receiver: receiver._id,
      skillRequested,
      status: "pending",
    });

    await newRequest.save();

    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    const receiverSocketId = onlineUsers.get(receiver._id.toString());

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("new-session-request", {
        requestId: newRequest._id,
        senderId: sender._id,
        senderName: sender.name,
        senderAvatar: sender.avatarUrl,
        skillRequested,
      });
    }

    res.status(201).json({
      message: "Request sent successfully",
      request: newRequest,
    });
  } catch (err) {
    console.error("Send Request Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 GET MY PENDING REQUESTS
const getMyRequests = async (req, res) => {
  try {
    const requests = await SessionRequest.find({
      receiver: req.user.id,
    })
      .populate("sender", "name avatarUrl teachSkills learnSkills")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 ACCEPT REQUEST
const acceptRequest = async (req, res) => {
  const { requestId } = req.body;

  try {
    const request = await SessionRequest.findById(requestId)
      .populate("sender", "name avatarUrl")
      .populate("receiver", "name");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Only receiver can accept
    if (request.receiver._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    request.status = "accepted";
    request.respondedAt = new Date();
    await request.save();

    // 🔔 Notify sender via socket
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    const senderSocketId = onlineUsers.get(
      request.sender._id.toString()
    );

    if (senderSocketId) {
      io.to(senderSocketId).emit("request-status-update", {
        requestId: request._id,
        status: "accepted",
        receiverName: request.receiver.name,
      });
    }

    res.json({
      message: "Request accepted",
      request,
    });
  } catch (err) {
    console.error("Accept Request Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 DECLINE REQUEST
const declineRequest = async (req, res) => {
  const { requestId } = req.body;

  try {
    const request = await SessionRequest.findById(requestId)
      .populate("sender", "name avatarUrl")
      .populate("receiver", "name");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.receiver._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    request.status = "declined";
    request.respondedAt = new Date();
    await request.save();

    // 🔔 Notify sender via socket
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    const senderSocketId = onlineUsers.get(
      request.sender._id.toString()
    );

    if (senderSocketId) {
      io.to(senderSocketId).emit("request-status-update", {
        requestId: request._id,
        status: "declined",
        receiverName: request.receiver.name,
      });
    }

    res.json({
      message: "Request declined",
      request,
    });
  } catch (err) {
    console.error("Decline Request Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const getRequestById = async (req, res) => {
  try {
    const request = await SessionRequest.findById(req.params.id)
      .populate("sender", "name avatarUrl teachSkills learnSkills")
      .populate("receiver", "name");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // only sender or receiver can view
    if (
      request.sender._id.toString() !== req.user.id &&
      request.receiver._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const getActiveSessions = async (req, res) => {
  try {
    const sessions = await SessionRequest.find({
      status: "accepted",
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id },
      ],
    })
      .populate("sender", "name avatarUrl")
      .populate("receiver", "name avatarUrl");

    res.json(sessions);
  } catch (err) {
    console.error("Get Active Sessions Error:", err);
    res.status(500).json({ message: "Failed to load sessions" });
  }
};


const terminateSession = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await SessionRequest.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Only sender or receiver can terminate
    if (
      session.sender.toString() !== req.user.id &&
      session.receiver.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await session.deleteOne();

    res.json({ message: "Session terminated successfully" });
  } catch (err) {
    console.error("Terminate session error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  sendRequest,
  getMyRequests,
  acceptRequest,
  declineRequest,
  getRequestById,
  getActiveSessions,
  terminateSession
};
