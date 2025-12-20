const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema({
  userA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  userAEmail: {
    type: String,
    required: true,
  },

  userB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  userBEmail: {
    type: String,
    required: true,
  },

  skillsInvolved: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model("StudySession", studySessionSchema);
