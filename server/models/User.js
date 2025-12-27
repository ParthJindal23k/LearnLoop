const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
      default: "",
    },

    teachSkills: {
      type: [String],
      default: [],
    },

    learnSkills: {
      type: [String],
      default: [],
    },

    avatarUrl: {
      type: String,
      default: "",
    },

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ⭐ Rating system
    ratingAvg: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    ratingCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for ranking / sorting users by rating
userSchema.index({ ratingAvg: -1 });

module.exports = mongoose.model("User", userSchema);
