const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  sendRequest,
  getMyRequests,
  acceptRequest,
  declineRequest,
} = require("../controllers/sessionRequestController");

router.post("/", auth, sendRequest);

router.get("/incoming", auth, getMyRequests);

router.post("/accept", auth, acceptRequest);
router.post("/decline", auth, declineRequest);

module.exports = router;
