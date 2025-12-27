const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  startSessionWithFriend,
  getActiveSessions,
  terminateSession,
} = require("../controllers/sessionRequestController");

// Start or resume a session
router.post("/start", auth, startSessionWithFriend);

// Get my active sessions
router.get("/active", auth, getActiveSessions);

// End a session
router.post("/terminate", auth, terminateSession);

module.exports = router;
