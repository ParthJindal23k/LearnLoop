const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  startSessionWithFriend,
  getActiveSessions,
  terminateSession,
} = require("../controllers/sessionRequestController");

router.post("/start", auth, startSessionWithFriend);

router.get("/active", auth, getActiveSessions);

router.post("/terminate", auth, terminateSession);

module.exports = router;
