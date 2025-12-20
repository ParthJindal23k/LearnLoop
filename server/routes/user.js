const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { changePassword } = require("../controllers/userController");
const {updateProfile} = require("../controllers/userController")
const { findFriends } = require("../controllers/userController");



// GET matching users
router.get("/find-friends", auth, findFriends);
router.put("/change-password", auth, changePassword);
router.put('/profile',auth,updateProfile)


module.exports = router;
