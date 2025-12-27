import { useEffect, useState } from "react";
import axios from "axios";
import { MoreVertical, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // =========================
  // 📥 LOAD FRIENDS (UNCHANGED)
  // =========================
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/friends`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFriends(res.data);
      } catch (err) {
        console.error("Failed to load friends", err);
      }
    };

    fetchFriends();
  }, [token]);

  // =========================
  // ▶ START SESSION (UNCHANGED)
  // =========================
  const startSession = async (friendId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/session/start`,
        { friendId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.data || !res.data.sessionId) {
        throw new Error("No sessionId returned from server");
      }

      navigate(`/session/${res.data.sessionId}`);
    } catch (err) {
      console.error("Start session error:", err);
      alert("Failed to start session");
    }
  };

  // =========================
  // ❌ REMOVE FRIEND (UNCHANGED)
  // =========================
  const removeFriend = async (friendId) => {
    if (!window.confirm("Remove this friend?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URI}/api/friends/${friendId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setFriends((prev) => prev.filter((f) => f._id !== friendId));
      setOpenMenu(null);
    } catch (err) {
      console.error("Remove friend error:", err);
      alert("Failed to remove friend");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Friends</h1>
        <p className="text-gray-500 mt-1">
          Your learning connections
        </p>
      </div>

      {/* EMPTY STATE */}
      {friends.length === 0 ? (
        <div className="bg-white rounded-2xl border p-16 text-center shadow-sm">
          <p className="text-gray-500 text-lg">
            You haven’t added any friends yet
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {friends.map((friend) => (
            <div
              key={friend._id}
              className="relative bg-white rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* MENU */}
              <button
                onClick={() =>
                  setOpenMenu(openMenu === friend._id ? null : friend._id)
                }
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100"
              >
                <MoreVertical size={18} className="text-gray-500" />
              </button>

              {openMenu === friend._id && (
                <div className="absolute right-4 top-12 bg-white border rounded-xl shadow-lg z-10 overflow-hidden">
                  <button
                    onClick={() => removeFriend(friend._id)}
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    Remove Friend
                  </button>
                </div>
              )}

              {/* USER INFO */}
              <div className="p-6 flex items-center gap-4">
                <img
                  src={friend.avatarUrl || "/default-avatar.png"}
                  alt="avatar"
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-500"
                />

                <div>
                  <p className="font-semibold text-gray-900 text-lg">
                    {friend.name}
                  </p>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    Friend
                  </span>
                </div>
              </div>

              {/* SKILLS */}
              <div className="px-6 pb-4 text-sm text-gray-700 space-y-2">
                <p>
                  <strong>Teaches:</strong>{" "}
                  {friend.teachSkills?.length
                    ? friend.teachSkills.join(", ")
                    : "—"}
                </p>

                <p>
                  <strong>Learns:</strong>{" "}
                  {friend.learnSkills?.length
                    ? friend.learnSkills.join(", ")
                    : "—"}
                </p>
              </div>

              {/* ACTION */}
              <div className="px-6 pb-6">
                <button
                  onClick={() => startSession(friend._id)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium transition hover:scale-[1.02]"
                >
                  <Video size={16} />
                  Start Session
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Friends;
