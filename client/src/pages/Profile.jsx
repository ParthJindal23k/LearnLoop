import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
const Profile = () => {
  const { user, setUser } = useAuth();
  const token = localStorage.getItem("token");

  // profile fields
  const [name, setName] = useState(user.name);
  const [teachSkills, setTeachSkills] = useState(user.teachSkills.join(", "));
  const [learnSkills, setLearnSkills] = useState(user.learnSkills.join(", "));

  // password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // ---------------------------
  // UPDATE PROFILE (name, skills, avatar)
  // ---------------------------
  const saveProfile = async (changeAvatar = false) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URI}/api/users/profile`,
        {
          name,
          teachSkills: teachSkills.split(",").map(s => s.trim()),
          learnSkills: learnSkills.split(",").map(s => s.trim()),
          changeAvatar,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // update global user
      setUser(res.data);
      alert("Profile updated");
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  // ---------------------------
  // CHANGE PASSWORD
  // ---------------------------
  const changePassword = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URI}/api/users/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Password change failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

      {/* AVATAR */}
      <div className="relative flex justify-center mb-10">
        <img
          src={user.avatarUrl}
          alt="avatar"
          className="w-32 h-32 rounded-full border-4 border-gray-700"
        />

        {/* change avatar button */}
        <button
          onClick={() => saveProfile(true)}
          className="absolute -bottom-3 bg-blue-600 px-3 py-1 rounded-full text-sm"
        >
          Change avatar
        </button>
      </div>

      {/* USERNAME */}
      <label className="block mb-4">
        <span className="text-sm">Username</span>
        <input
          className="w-full mt-1 p-2 rounded bg-gray-800"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      {/* TEACH SKILLS */}
      <label className="block mb-4">
        <span className="text-sm">Teach skills (comma separated)</span>
        <input
          className="w-full mt-1 p-2 rounded bg-gray-800"
          value={teachSkills}
          onChange={(e) => setTeachSkills(e.target.value)}
        />
      </label>

      {/* LEARN SKILLS */}
      <label className="block mb-6">
        <span className="text-sm">Learn skills (comma separated)</span>
        <input
          className="w-full mt-1 p-2 rounded bg-gray-800"
          value={learnSkills}
          onChange={(e) => setLearnSkills(e.target.value)}
        />
      </label>

      <button
        style={{ backgroundColor: "var(--primary-color)" }}
        className="px-4 py-2 rounded"
      >
        Save Profile
      </button>


      {/* CHANGE PASSWORD */}
      <h2 className="text-xl font-semibold mb-3">Change Password</h2>

      <input
        type="password"
        placeholder="Current password"
        className="w-full p-2 mb-2 rounded bg-gray-800"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="New password"
        className="w-full p-2 mb-4 rounded bg-gray-800"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <button
        onClick={changePassword}
        className="bg-red-600 px-4 py-2 rounded"
      >
        Change Password
      </button>
    </div>
  );
};

export default Profile;
