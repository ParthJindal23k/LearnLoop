const mongoose = require("mongoose");

const callHistorySchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudySession",
    required: true,
  },

  callerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  startedAt: Date,
  endedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model("CallHistory", callHistorySchema);
