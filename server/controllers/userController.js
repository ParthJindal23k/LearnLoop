const User = require("../models/User");
const bcrypt = require("bcryptjs");


// random avatar generator
const generateAvatar = () => {
  const randomId = Math.floor(Math.random() * 1000);
  return `https://avatar.iran.liara.run/public/${randomId}`;
};

const updateProfile = async (req, res) => {
  try {
    const { name, teachSkills, learnSkills, changeAvatar } = req.body;

    const updates = {};

    if (name) updates.name = name;
    if (teachSkills) updates.teachSkills = teachSkills;
    if (learnSkills) updates.learnSkills = learnSkills;
    if (changeAvatar) updates.avatarUrl = generateAvatar();

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Profile update failed" });
  }
};




// 🔹 Change password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change Password Error:", err);
    res.status(500).json({ message: "Password update failed" });
  }
};

const findFriends = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const users = await User.find({
      _id: { $ne: currentUser._id }, // exclude self
    }).select("-password");

    const rankedUsers = users.map((user) => {
      const userTeach = user.teachSkills || [];
      const userLearn = user.learnSkills || [];
      const currentTeach = currentUser.teachSkills || [];
      const currentLearn = currentUser.learnSkills || [];

      const teachesWhatILearn = userTeach.some(skill =>
        currentLearn.includes(skill)
      );

      const learnsWhatITeach = userLearn.some(skill =>
        currentTeach.includes(skill)
      );


      let matchType = "none";
      let score = 0;

      if (teachesWhatILearn && learnsWhatITeach) {
        matchType = "perfect";
        score = 3;
      } else if (teachesWhatILearn || learnsWhatITeach) {
        matchType = "partial";
        score = 2;
      } else {
        matchType = "none";
        score = 1;
      }

      return {
        user,
        matchType,
        score,
      };
    });

    // sort by score (highest first)
    rankedUsers.sort((a, b) => b.score - a.score);

    res.json(rankedUsers);
  } catch (err) {
    console.error("Find Friends Error:", err);
    res.status(500).json({ message: "Failed to find friends" });
  }
};


module.exports = {
  changePassword, updateProfile, findFriends
};