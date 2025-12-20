const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { sendFriendRequest,getMyFriendRequests } = require("../controllers/friendController");

// 🤝 Send friend request
router.post("/send", auth, sendFriendRequest);
router.get("/incoming", auth, getMyFriendRequests);


module.exports = router;
