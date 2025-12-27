import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Check, X } from "lucide-react";

const NotificationDetailCard = ({ notification, onUpdate }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // 🛡 SAFE SENDER FALLBACK
  const sender =
    notification.sender || {
      name: notification.senderName || "Unknown User",
      avatarUrl:
        notification.senderAvatar ||
        "https://avatar.iran.liara.run/public",
      teachSkills: [],
      learnSkills: [],
      ratingAvg: null,
    };

  // =========================
  // ✅ HANDLE ACCEPT / DECLINE
  // =========================
  const handleAction = async (action) => {
    try {
      let url = "";

      if (notification.type === "session-request") {
        url = `/api/session-request/${action}`;
      }

      if (notification.type === "friend-request") {
        url = `/api/friends/${action}`;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}${url}`,
        { requestId: notification._id || notification.requestId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onUpdate(
        notification._id || notification.requestId,
        action === "accept" ? "accepted" : "declined"
      );

      if (
        notification.type === "session-request" &&
        action === "accept" &&
        res.data?.sessionId
      ) {
        navigate(`/session/${res.data.sessionId}`);
      }
    } catch (err) {
      console.error("Notification action failed:", err);
      alert("Action failed");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 max-w-xl">
      {/* USER HEADER */}
      <div className="flex items-center gap-4 mb-5">
        <img
          src={sender.avatarUrl}
          alt="avatar"
          className="w-16 h-16 rounded-full object-cover border"
        />

        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900">
            {sender.name}
          </h2>
          <p className="text-sm text-gray-500">
            ⭐ {sender.ratingAvg ? sender.ratingAvg.toFixed(1) : "New user"}
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="space-y-3 text-sm text-gray-700">
        {notification.type === "session-request" && (
          <>
            <p>
              <span className="font-medium text-gray-900">
                Requested skill:
              </span>{" "}
              {notification.skillRequested}
            </p>

            <div>
              <p className="font-medium text-gray-900 mb-1">
                Teaches
              </p>
              <div className="flex flex-wrap gap-2">
                {sender.teachSkills?.length ? (
                  sender.teachSkills.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </div>
            </div>

            <div>
              <p className="font-medium text-gray-900 mb-1">
                Wants to learn
              </p>
              <div className="flex flex-wrap gap-2">
                {sender.learnSkills?.length ? (
                  sender.learnSkills.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </div>
            </div>
          </>
        )}

        {notification.type === "friend-request" && (
          <p className="text-gray-600">
            This user wants to connect with you as a friend.
          </p>
        )}
      </div>

      {/* STATUS */}
      <div className="mt-4 text-sm">
        <span className="font-medium text-gray-900">Status:</span>{" "}
        <span className="capitalize text-gray-600">
          {notification.status || "pending"}
        </span>
      </div>

      {/* ACTIONS */}
      {notification.status === "pending" && (
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => handleAction("accept")}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition"
          >
            <Check size={16} />
            Accept
          </button>

          <button
            onClick={() => handleAction("decline")}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium transition"
          >
            <X size={16} />
            Decline
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDetailCard;
