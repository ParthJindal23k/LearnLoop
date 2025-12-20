const FriendRequest = require("../models/FriendsRequest");
const User = require("../models/User");

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
    });

    if (existing) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    const request = new FriendRequest({
      sender: sender._id,
      receiver: receiver._id,
    });

    await request.save();

    // 🔔 REAL-TIME NOTIFICATION
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    const receiverSocketId = onlineUsers.get(receiver._id.toString());

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("new-friend-request", {
        requestId: request._id,
        senderId: sender._id,
        senderName: sender.name,
        senderAvatar: sender.avatarUrl,
        createdAt: new Date(),
      });
    }

    res.status(201).json({ message: "Friend request sent" });
  } catch (err) {
    console.error("Send friend request error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const getMyFriendRequests = async (req, res) => {
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
        senderName: r.sender.name,
        senderAvatar: r.sender.avatarUrl,
        createdAt: r.createdAt,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: "Failed to load friend requests" });
  }
};


module.exports = { sendFriendRequest , getMyFriendRequests };
