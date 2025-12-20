import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { socket } from "../../socket";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const ref = useRef(null);
  const navigate = useNavigate();

  // ================================
  // 🔔 SOCKET REAL-TIME EVENTS
  // ================================
  useEffect(() => {
    // 🔹 New session request (receiver side)
    const onSessionRequest = (data) => {
      addNotification({
        type: "session-request",
        requestId: data.requestId,
        senderName: data.senderName,
        senderAvatar: data.senderAvatar,
        createdAt: new Date(),
      });
    };

    // 🔹 Session accepted / declined (sender side)
    const onStatusUpdate = (data) => {
      addNotification({
        type: "session-status",
        requestId: data.requestId,
        senderName: data.receiverName, // who acted
        senderAvatar: data.receiverAvatar,
        status: data.status,
        createdAt: new Date(),
      });
    };

    // 🔹 Friend request
    const onFriendRequest = (data) => {
      addNotification({
        type: "friend-request",
        requestId: data.requestId,
        senderName: data.senderName,
        senderAvatar: data.senderAvatar,
        createdAt: new Date(),
      });
    };

    socket.on("new-session-request", onSessionRequest);
    socket.on("request-status-update", onStatusUpdate);
    socket.on("new-friend-request", onFriendRequest);

    return () => {
      socket.off("new-session-request", onSessionRequest);
      socket.off("request-status-update", onStatusUpdate);
      socket.off("new-friend-request", onFriendRequest);
    };
  }, []);

  // ================================
  // 🧠 SAFE ADD (NO DUPLICATES)
  // ================================
  const addNotification = (notif) => {
    setNotifications((prev) => {
      const exists = prev.some(
        (n) =>
          n.requestId === notif.requestId &&
          n.type === notif.type
      );
      if (exists) return prev;
      return [notif, ...prev];
    });
  };

  // ================================
  // 📦 LOAD PAST NOTIFICATIONS
  // ================================
  useEffect(() => {
    if (!open) return;

    const loadNotifications = async () => {
      try {
        const token = localStorage.getItem("token");

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
          type: "session-request",
          requestId: n._id,
          senderName:
            n.sender?.name ||
            n.senderName ||
            "Unknown User",
          senderAvatar:
            n.sender?.avatarUrl ||
            "https://avatar.iran.liara.run/public",
          createdAt: n.createdAt,
        }));

        const friendNotifs = friendRes.data.map((n) => ({
          type: "friend-request",
          requestId: n._id,
          senderName:
            n.sender?.name ||
            n.from?.name ||
            n.senderName ||
            "Unknown User",
          senderAvatar:
            n.sender?.avatarUrl ||
            n.from?.avatarUrl ||
            "https://avatar.iran.liara.run/public",
          createdAt: n.createdAt,
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

    loadNotifications();
  }, [open]);

  // ================================
  // ❌ CLOSE ON OUTSIDE CLICK
  // ================================
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ================================
  // 🎨 UI
  // ================================
  return (
    <div className="relative" ref={ref}>
      {/* Bell */}
      <button onClick={() => setOpen(!open)} className="relative">
        <Bell />

        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-1">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-3 w-96 rounded-lg shadow-lg border z-50"
          style={{
            backgroundColor: "var(--bg-color)",
            borderColor: "var(--secondary-color)",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          <div className="px-4 py-3 font-semibold border-b">
            Notifications
          </div>

          {notifications.length === 0 ? (
            <p className="p-4 text-sm opacity-70">
              No notifications
            </p>
          ) : (
            notifications.slice(0, 8).map((n) => (
              <div
                key={`${n.type}-${n.requestId}`}
                onClick={() => {
                  setOpen(false);
                  navigate("/notification");
                }}
                className="flex gap-3 px-4 py-3 hover:bg-black/10 cursor-pointer border-b"
              >
                <img
                  src={n.senderAvatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                />

                <div className="flex-1">
                  <p className="text-sm">
                    <strong>{n.senderName}</strong>{" "}
                    {renderText(n)}
                  </p>

                  <p className="text-xs opacity-60 mt-1">
                    {timeAgo(new Date(n.createdAt))}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// ================================
// 📝 TEXT RENDERER
// ================================
const renderText = (n) => {
  if (n.type === "friend-request") {
    return "sent you a friend request";
  }

  if (n.type === "session-request") {
    return "sent you a session request";
  }

  if (n.type === "session-status") {
    return n.status === "accepted"
      ? "accepted your session request"
      : "declined your session request";
  }

  return "";
};

// ================================
// ⏱ TIME FORMATTER
// ================================
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hrs ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
};

export default NotificationBell;
