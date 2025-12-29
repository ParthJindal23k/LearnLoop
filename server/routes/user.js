const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { changePassword } = require("../controllers/userController");
const {updateProfile} = require("../controllers/userController")
const { findFriends } = require("../controllers/userController");
const onlineUsers = require("../utils/onlineUser")


router.get("/find-friends", auth, findFriends);
router.put("/change-password", auth, changePassword);
router.put('/profile',auth,updateProfile)
router.get("/online" , (req,res) =>{
    res.json([...onlineUsers.keys()]);
})


module.exports = router;
