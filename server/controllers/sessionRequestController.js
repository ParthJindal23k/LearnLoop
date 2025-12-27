const SessionRequest = require("../models/SessionRequest");
const User = require("../models/User");
const Session = require("../models/Session");

/* =========================
   START SESSION WITH FRIEND
========================= */
const startSessionWithFriend = async (req, res) => {
  try {
    const { friendId } = req.body;

    const me = await User.findById(req.user.id);
    if (!me.friends.includes(friendId)) {
      return res.status(403).json({ message: "Not friends" });
    }

    // check existing active session
    const existingSession = await Session.findOne({
      participants: { $all: [req.user.id, friendId] },
      status: "active",
    });

    if (existingSession) {
      return res.json({ sessionId: existingSession._id });
    }

    const session = await Session.create({
      participants: [req.user.id, friendId],
      status: "active",
    });

    res.status(201).json({ sessionId: session._id });
  } catch (err) {
    console.error("Start session error:", err);
    res.status(500).json({ message: "Failed to start session" });
  }
};

/* =========================
   SEND SESSION REQUEST
========================= */
const sendRequest = async (req, res) => {
  const { receiverId, skillRequested } = req.body;

  try {
    if (receiverId === req.user.id) {
      return res.status(400).json({ message: "Cannot send request to yourself" });
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

    const newRequest = await SessionRequest.create({
      sender: sender._id,
      receiver: receiver._id,
      skillRequested,
    });

    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");
    const receiverSocketId = onlineUsers.get(receiver._id.toString());

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("new-session-request", {
        requestId: newRequest._id,
        senderName: sender.name,
        senderAvatar: sender.avatarUrl,
        skillRequested,
      });
    }

    res.status(201).json({ message: "Request sent", request: newRequest });
  } catch (err) {
    console.error("Send request error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET INCOMING REQUESTS
========================= */
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

/* =========================
   ACCEPT REQUEST
========================= */
const acceptRequest = async (req, res) => {
  const { requestId } = req.body;

  try {
    console.log("ACCEPT REQUEST HIT");

    const request = await SessionRequest.findById(requestId)
      .populate("sender", "name avatarUrl")
      .populate("receiver", "name avatarUrl");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.receiver._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // 1️⃣ mark request accepted
    request.status = "accepted";
    request.respondedAt = new Date();
    await request.save();

    // 2️⃣ CREATE REAL SESSION 🔥🔥🔥
    const session = await Session.create({
      participants: [request.sender._id, request.receiver._id],
      status: "active",
    });

    // 3️⃣ socket notify sender
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");
    const senderSocketId = onlineUsers.get(request.sender._id.toString());

    if (senderSocketId) {
      io.to(senderSocketId).emit("session-started", {
        sessionId: session._id,
      });
    }

    res.json({
      message: "Request accepted & session started",
      sessionId: session._id,
    });
  } catch (err) {
    console.error("Accept Request Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   DECLINE REQUEST
========================= */
const declineRequest = async (req, res) => {
  const { requestId } = req.body;

  try {
    const request = await SessionRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.receiver.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    request.status = "declined";
    request.respondedAt = new Date();
    await request.save();

    res.json({ message: "Request declined" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET ACTIVE SESSIONS (FIXED)
========================= */
const getActiveSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      participants: req.user.id,
      status: "active",
    }).populate("participants", "name avatarUrl ratingAvg ratingCount");

    res.json(sessions);
  } catch (err) {
    console.error("Get active sessions error:", err);
    res.status(500).json({ message: "Failed to load sessions" });
  }
};

/* =========================
   TERMINATE SESSION (RATING READY)
========================= */
const terminateSession = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (!session.participants.includes(req.user.id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    session.status = "ended";
    session.endedAt = new Date();
    session.endedBy = req.user.id;
    await session.save();

    const io = req.app.get("io");

    // 🔔 Notify BOTH users → open rating popup
    io.to(sessionId).emit("session-ended", {
      sessionId,
      endedBy: req.user.id,
    });

    res.json({ message: "Session ended" });
  } catch (err) {
    console.error("Terminate session error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  startSessionWithFriend,
  sendRequest,
  getMyRequests,
  acceptRequest,
  declineRequest,
  getActiveSessions,
  terminateSession,
};
