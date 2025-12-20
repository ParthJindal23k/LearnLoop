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

  // 🔹 Send session request
  const sendSessionRequest = async (receiverId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/session-request`,
        {
          receiverId:receiverId,
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
    <div>
      <h1 className="text-2xl font-bold mb-6">Find Friends</h1>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(({ user, matchType }) => {
            const isSent = sentRequests.includes(user._id);

            return (
              <div
                key={user._id}
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: "var(--bg-color)",
                  borderColor:
                    matchType === "perfect"
                      ? "var(--primary-color)"
                      : "var(--secondary-color)",
                }}
              >
                {/* User info */}
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={user.avatarUrl}
                    alt="avatar"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm opacity-70 capitalize">
                      {matchType} match
                    </p>
                  </div>
                </div>

                {/* Skills */}
                <p className="text-sm mb-1">
                  <strong>Teaches:</strong>{" "}
                  {user.teachSkills.length > 0
                    ? user.teachSkills.join(", ")
                    : "—"}
                </p>

                <p className="text-sm mb-4">
                  <strong>Learns:</strong>{" "}
                  {user.learnSkills.length > 0
                    ? user.learnSkills.join(", ")
                    : "—"}
                </p>

                {/* Action */}
                <button
                  disabled={isSent}
                  onClick={() => sendSessionRequest(user._id)}
                  className="w-full py-1 rounded"
                  style={{
                    backgroundColor: isSent
                      ? "#555"
                      : "var(--primary-color)",
                    cursor: isSent ? "not-allowed" : "pointer",
                  }}
                >
                  {isSent ? "Request Sent" : "Send Session Request"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FindFriends;
