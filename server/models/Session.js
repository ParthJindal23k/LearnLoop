const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    endedAt: {
      type: Date,
      default: null,
    },

    endedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

// useful index for fast active-session lookup
sessionSchema.index({ participants: 1, status: 1 });

module.exports = mongoose.model("Session", sessionSchema);
