const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  sendFriendRequest,
  getIncomingFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  getMyFriends,
  removeFriend
} = require("../controllers/friendController");

router.post("/request", auth, sendFriendRequest);

router.get("/incoming", auth, getIncomingFriendRequests);


router.post("/accept", auth, acceptFriendRequest);

router.post("/decline", auth, declineFriendRequest);

router.get("/", auth, getMyFriends);

router.delete("/:friendId" , auth , removeFriend)

module.exports = router;
