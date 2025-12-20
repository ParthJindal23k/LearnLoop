import { useEffect, useState } from "react";
import axios from "axios";
import NotificationDetailCard from "../components/notifications/NotificationDetailCard";


const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [selected, setSelected] = useState(null);
  const token = localStorage.getItem("token");

  const updateStatus = (id, newStatus) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === id ? { ...n, status: newStatus } : n
      )
    );
  };


  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [sessionRes, friendRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_BACKEND_URI}/api/session-request/incoming`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(
            `${import.meta.env.VITE_BACKEND_URI}/api/friends/incoming`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ]);

        const sessionNotifs = sessionRes.data.map((n) => ({
          ...n,
          type: "session",
        }));

        const friendNotifs = friendRes.data.map((n) => ({
          ...n,
          type: "friend",
        }));

        setNotifications(
          [...sessionNotifs, ...friendNotifs].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="flex h-[calc(100vh-64px)]">

      <div className="w-1/3 border-r overflow-y-auto">
        {notifications.map((n) => (
  <div
    key={`${n.type}-${n._id || n.requestId}`}
    onClick={() => setSelected(n)}
    className={`p-4 cursor-pointer border-b ${
      selected?._id === n._id ? "bg-black/10" : ""
    }`}
  >
    <div className="flex gap-3">
      {/* ✅ SAFE AVATAR */}
      <img
        src={
          n.sender?.avatarUrl ||
          n.senderAvatar ||
          "https://avatar.iran.liara.run/public"
        }
        className="w-10 h-10 rounded-full"
      />

      <div>
        {/* ✅ SAFE NAME */}
        <p className="font-semibold">
          {n.sender?.name || n.senderName || "Unknown User"}
        </p>

        {/* ✅ SAFE DESCRIPTION */}
        <p className="text-sm opacity-70">
          {n.type === "friend-request"
            ? "Sent you a friend request"
            : n.type === "session"
            ? `Requested session for ${n.skillRequested}`
            : n.status === "accepted"
            ? "Accepted your session request"
            : "Declined your session request"}
        </p>

        <p className="text-xs opacity-50 capitalize">
          {n.status || "pending"}
        </p>
      </div>
    </div>
  </div>
))}

      </div>

      <div className="flex-1 p-6">
        {!selected ? (
          <p className="opacity-60">Select a notification</p>
        ) : (
          <NotificationDetailCard
            notification={selected}
            onUpdate={updateStatus}
          />
        )}
      </div>
    </div>
  );
};



export default Notification;
