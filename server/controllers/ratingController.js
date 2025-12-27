const Rating = require("../models/Rating");
const User = require("../models/User");
const Session = require("../models/Session");

/**
 * POST /api/ratings
 * Submit rating for a session
 */
const submitRating = async (req, res) => {
  try {
    const { sessionId, ratedUserId, score, feedback } = req.body;
    const raterId = req.user.id;

    // basic validation
    if (!sessionId || !ratedUserId || !score) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (score < 1 || score > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // check session exists
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // check rater is part of session
    if (!session.participants.includes(raterId)) {
      return res.status(403).json({ message: "Not part of this session" });
    }

    // prevent rating yourself
    if (ratedUserId === raterId) {
      return res.status(400).json({ message: "Cannot rate yourself" });
    }

    // create rating (unique index prevents duplicates)
    const rating = await Rating.create({
      session: sessionId,
      rater: raterId,
      ratedUser: ratedUserId,
      score,
      feedback: feedback || "",
    });

    // update rated user's average rating
    const ratedUser = await User.findById(ratedUserId);

    const newCount = ratedUser.ratingCount + 1;
    const newAvg =
      (ratedUser.ratingAvg * ratedUser.ratingCount + score) / newCount;

    ratedUser.ratingCount = newCount;
    ratedUser.ratingAvg = Number(newAvg.toFixed(2));
    await ratedUser.save();

    res.status(201).json({
      message: "Rating submitted successfully",
      rating,
      newAverage: ratedUser.ratingAvg,
    });
  } catch (err) {
    // duplicate rating (unique index error)
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "You already rated this session" });
    }

    console.error("Submit rating error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ratingsController.js
const getPendingRatings = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1️⃣ Find ended sessions involving this user
    const sessions = await Session.find({
      participants: userId,
      status: "ended",
    }).populate("participants", "name avatarUrl");

    // 2️⃣ Find sessions already rated by this user
    const ratings = await Rating.find({ rater: userId }).select("session");
    const ratedSessionIds = ratings.map((r) => r.session.toString());

    // 3️⃣ Filter sessions not yet rated
    const pending = sessions.filter(
      (s) => !ratedSessionIds.includes(s._id.toString())
    );

    // 4️⃣ Map response (include other user)
    const response = pending.map((session) => {
      const otherUser = session.participants.find(
        (p) => p._id.toString() !== userId
      );

      return {
        sessionId: session._id,
        otherUser,
      };
    });

    res.json(response);
  } catch (err) {
    console.error("Get pending ratings error:", err);
    res.status(500).json({ message: "Failed to load pending ratings" });
  }
};

module.exports = {
  submitRating,getPendingRatings
};
