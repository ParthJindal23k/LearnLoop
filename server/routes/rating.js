const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { submitRating,getPendingRatings } = require("../controllers/ratingController");

router.post("/", auth, submitRating);
router.get('/pending' , auth , getPendingRatings)

module.exports = router;
