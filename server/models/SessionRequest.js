const mongoose = require("mongoose");

const sessionRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    skillRequested: {
      type: String,
      required: true, 
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },

    respondedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

sessionRequestSchema.index(
  { sender: 1, receiver: 1, skillRequested: 1 },
  { unique: true }
);

module.exports = mongoose.model("SessionRequest", sessionRequestSchema);
