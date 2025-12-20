const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Message = require("../models/Message");

router.get("/:sessionId", auth, async (req, res) => {
  const messages = await Message.find({
    sessionId: req.params.sessionId,
  }).populate("sender", "name avatarUrl");

  res.json(messages);
});

module.exports = router;
