import { useEffect, useState } from "react";
import axios from "axios";

const FindFriends = () => {
  const [users, setUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/users/find-friends`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, []);

  // 🔹 Send session request (UNCHANGED)
  const sendSessionRequest = async (receiverId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/session-request`,
        {
          receiverId: receiverId,
          skillRequested: "SkillSwap Session",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSentRequests((prev) => [...prev, receiverId]);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send request");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Find Friends
        </h1>
        <p className="text-gray-500 mt-1">
          Discover people who match your learning goals
        </p>
      </div>

      {/* EMPTY STATE */}
      {users.length === 0 ? (
        <div className="bg-white rounded-2xl border p-16 text-center shadow-sm">
          <p className="text-gray-500 text-lg">
            No users found at the moment
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {users.map(({ user, matchType }) => {
            const isSent = sentRequests.includes(user._id);

            return (
              <div
                key={user._id}
                className="bg-white rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* TOP SECTION */}
                <div className="p-6 flex items-center gap-4">
                  <img
                    src={user.avatarUrl}
                    alt="avatar"
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-500"
                  />

                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-lg">
                      {user.name}
                    </p>

                    {/* MATCH BADGE */}
                    <span
                      className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-medium ${
                        matchType === "perfect"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {matchType} match
                    </span>
                  </div>
                </div>

                {/* SKILLS */}
                <div className="px-6 pb-4 space-y-2 text-sm text-gray-700">
                  <p>
                    <strong>Teaches:</strong>{" "}
                    {user.teachSkills.length > 0
                      ? user.teachSkills.join(", ")
                      : "—"}
                  </p>

                  <p>
                    <strong>Learns:</strong>{" "}
                    {user.learnSkills.length > 0
                      ? user.learnSkills.join(", ")
                      : "—"}
                  </p>
                </div>

                {/* ACTION */}
                <div className="px-6 pb-6">
                  <button
                    disabled={isSent}
                    onClick={() => sendSessionRequest(user._id)}
                    className={`w-full py-2.5 rounded-xl font-medium transition-all ${
                      isSent
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.02]"
                    }`}
                  >
                    {isSent ? "Request Sent" : "Send Session Request"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FindFriends;
