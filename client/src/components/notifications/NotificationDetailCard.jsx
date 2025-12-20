import axios from "axios";

const NotificationDetailCard = ({ notification, onUpdate }) => {
  const token = localStorage.getItem("token");

  // 🛡 SAFE ACCESS
  const sender =
    notification.sender ||
    {
      name: notification.senderName || "Unknown User",
      avatarUrl:
        notification.senderAvatar ||
        "https://avatar.iran.liara.run/public",
      teachSkills: [],
      learnSkills: [],
    };

  const handleAction = async (type) => {
    try {
      // Only session requests can be accepted / declined
      if (notification.type !== "session-request") return;

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/session-request/${type}`,
        { requestId: notification._id || notification.requestId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onUpdate(
        notification._id || notification.requestId,
        type === "accept" ? "accepted" : "declined"
      );
    } catch (err) {
      alert("Action failed");
    }
  };

  return (
    <div className="max-w-xl">
      {/* USER INFO */}
      <div className="flex gap-4 mb-4">
        <img
          src={sender.avatarUrl}
          className="w-16 h-16 rounded-full"
          alt="avatar"
        />

        <div>
          <h2 className="text-xl font-bold">{sender.name}</h2>
          <p className="opacity-70">⭐ 4.5 Rating</p>
        </div>
      </div>

      {/* DETAILS */}
      {notification.type === "session-request" && (
        <>
          <p>
            <strong>Requested Skill:</strong>{" "}
            {notification.skillRequested}
          </p>

          <p>
            <strong>Teaches:</strong>{" "}
            {sender.teachSkills?.length
              ? sender.teachSkills.join(", ")
              : "—"}
          </p>

          <p>
            <strong>Learns:</strong>{" "}
            {sender.learnSkills?.length
              ? sender.learnSkills.join(", ")
              : "—"}
          </p>
        </>
      )}

      {notification.type === "friend-request" && (
        <p className="opacity-80">
          This user sent you a friend request.
        </p>
      )}

      {notification.type === "session-status" && (
        <p className="opacity-80 capitalize">
          Session request was {notification.status}
        </p>
      )}

      {/* STATUS */}
      <p className="mt-2 capitalize">
        <strong>Status:</strong>{" "}
        {notification.status || "pending"}
      </p>

      {/* ACTION BUTTONS */}
      {notification.type === "session-request" &&
        notification.status === "pending" && (
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => handleAction("accept")}
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
            >
              Accept
            </button>

            <button
              onClick={() => handleAction("decline")}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
            >
              Decline
            </button>
          </div>
        )}
    </div>
  );
};

export default NotificationDetailCard;
