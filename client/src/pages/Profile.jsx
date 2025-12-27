import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Camera } from "lucide-react";

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
  // UPDATE PROFILE
  // ---------------------------
  const saveProfile = async (changeAvatar = false) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URI}/api/users/profile`,
        {
          name,
          teachSkills: teachSkills.split(",").map((s) => s.trim()),
          learnSkills: learnSkills.split(",").map((s) => s.trim()),
          changeAvatar,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(res.data);
      alert("Profile updated");
    } catch {
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
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Password change failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* ================= PROFILE CARD ================= */}
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Profile Settings
          </h1>

          {/* AVATAR */}
          <div className="flex items-center gap-6 mb-8">
            <div className="relative group">
              <img
                src={user.avatarUrl}
                alt="avatar"
                className="w-28 h-28 rounded-full object-cover border"
              />

              <button
                onClick={() => saveProfile(true)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center text-white transition"
              >
                <Camera size={20} />
              </button>
            </div>

            <div>
              <p className="text-lg font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">
                Update your public profile details
              </p>
            </div>
          </div>

          {/* FORM */}
          <div className="grid gap-6">
            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Display Name
              </label>
              <input
                className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Skills you can teach
              </label>
              <input
                className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={teachSkills}
                onChange={(e) => setTeachSkills(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Skills you want to learn
              </label>
              <input
                className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={learnSkills}
                onChange={(e) => setLearnSkills(e.target.value)}
              />
            </div>

            <button
              onClick={() => saveProfile(false)}
              className="self-start bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* ================= SECURITY CARD ================= */}
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Security
          </h2>

          <div className="grid gap-4 max-w-md">
            <input
              type="password"
              placeholder="Current password"
              className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="New password"
              className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              onClick={changePassword}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
            >
              Change Password
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
