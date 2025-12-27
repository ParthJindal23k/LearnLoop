const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  sendRequest,
  getMyRequests,
  acceptRequest,
  declineRequest,
} = require("../controllers/sessionRequestController");

// =========================
// SEND SESSION REQUEST
// =========================
router.post("/", auth, sendRequest);

// =========================
// GET INCOMING REQUESTS
// =========================
router.get("/incoming", auth, getMyRequests);

// =========================
// ACCEPT REQUEST
// =========================
router.post("/accept", auth, acceptRequest);

// =========================
// DECLINE REQUEST
// =========================
router.post("/decline", auth, declineRequest);

module.exports = router;
