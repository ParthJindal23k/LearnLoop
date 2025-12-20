const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  sendRequest,
  getMyRequests,
  acceptRequest,
  declineRequest,
  getRequestById,
  getActiveSessions,
  terminateSession
} = require("../controllers/sessionRequestController");

// 🔹 Send session request
router.post("/", auth, sendRequest);

// 🔹 Get incoming requests
router.get("/incoming", auth, getMyRequests);

// 🔹 Accept request
router.post("/accept", auth, acceptRequest);

// 🔹 Decline request
router.post("/decline", auth, declineRequest);

// 🔹 Get active sessions
router.get("/active", auth, getActiveSessions);

router.get("/:id", auth, getRequestById);

router.post("/terminate" , auth , terminateSession)




module.exports = router;
