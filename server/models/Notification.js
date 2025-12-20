const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  userEmail: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },

  isRead: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
