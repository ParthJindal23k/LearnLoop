const FriendRequest = require("../models/FriendsRequest");
const User = require("../models/User");

const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;

    await User.findByIdAndUpdate(req.user.id, {
      $pull: { friends: friendId },
    });

    await User.findByIdAndUpdate(friendId, {
      $pull: { friends: req.user.id },
    });

    res.json({ message: "Friend removed" });
  } catch (err) {
    console.error("Remove Friend Error:", err);
    res.status(500).json({ message: "Failed to remove friend" });
  }
};



const sendFriendRequest = async (req, res) => {
  const { receiverId } = req.body;

  try {
    if (receiverId === req.user.id) {
      return res.status(400).json({ message: "Cannot send request to yourself" });
    }

    const sender = await User.findById(req.user.id);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    const existing = await FriendRequest.findOne({
      sender: sender._id,
      receiver: receiver._id,
      status: "pending",
    });

    if (existing) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    const request = await FriendRequest.create({
      sender: sender._id,
      receiver: receiver._id,
    });

    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    const receiverSocketId = onlineUsers.get(receiver._id.toString());

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("new-friend-request", {
        requestId: request._id,
        type: "friend-request",
        senderName: sender.name,
        senderAvatar: sender.avatarUrl,
        status: "pending",
        createdAt: request.createdAt,
      });
    }

    res.status(201).json({ message: "Friend request sent" });
  } catch (err) {
    console.error("Send friend request error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getIncomingFriendRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({
      receiver: req.user.id,
      status: "pending",
    })
      .populate("sender", "name avatarUrl")
      .sort({ createdAt: -1 });

    res.json(
      requests.map((r) => ({
        _id: r._id,
        type: "friend-request",
        status: r.status,
        senderName: r.sender.name,
        senderAvatar: r.sender.avatarUrl,
        createdAt: r.createdAt,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: "Failed to load friend requests" });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    const request = await FriendRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = "accepted";
    await request.save();

    await User.findByIdAndUpdate(request.sender, {
      $addToSet: { friends: request.receiver },
    });
    await User.findByIdAndUpdate(request.receiver, {
      $addToSet: { friends: request.sender },
    });

    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    const senderSocketId = onlineUsers.get(request.sender.toString());

    if (senderSocketId) {
      io.to(senderSocketId).emit("friend-request-status", {
        requestId,
        type: "friend-request",
        receiverName: req.user.name,
        status: "accepted",
      });
    }

    res.json({ message: "Friend request accepted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to accept friend request" });
  }
};

const declineFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    const request = await FriendRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = "declined";
    await request.save();

    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    const senderSocketId = onlineUsers.get(request.sender.toString());

    if (senderSocketId) {
      io.to(senderSocketId).emit("friend-request-status", {
        requestId,
        type: "friend-request",
        receiverName: req.user.name,
        status: "declined",
      });
    }

    res.json({ message: "Friend request declined" });
  } catch (err) {
    res.status(500).json({ message: "Failed to decline friend request" });
  }
};

const getMyFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("friends", "name avatarUrl teachSkills learnSkills")
      .select("friends");

    res.json(user.friends);
  } catch (err) {
    console.error("Get Friends Error:", err);
    res.status(500).json({ message: "Failed to load friends" });
  }
};



module.exports = {
  sendFriendRequest,
  getIncomingFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  getMyFriends,
  removeFriend
};
