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

  const token = localStorage.getItem("token");


  useEffect(() => {
    if (!token) return;

    const onSessionRequest = (data) => {
      addNotification({
        type: "session-request",
        requestId: data.requestId,
        senderName: data.senderName,
        senderAvatar: data.senderAvatar,
        createdAt: new Date(),
        seen: false
      });
    };

    const onStatusUpdate = (data) => {
      addNotification({
        type: "session-status",
        requestId: data.requestId,
        senderName: data.receiverName,
        senderAvatar: data.receiverAvatar,
        status: data.status,
        createdAt: new Date(),
        seen: false
      });
    };

    const onFriendRequest = (data) => {
      addNotification({
        type: "friend-request",
        requestId: data.requestId,
        senderName: data.senderName,
        senderAvatar: data.senderAvatar,
        createdAt: new Date(),
        seen: false
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
  }, [token]);

 
  const addNotification = (notif) => {
    setNotifications((prev) => {
      const exists = prev.some(
        (n) => n.type === notif.type && n.requestId === notif.requestId
      );
      return exists ? prev : [notif, ...prev];
    });
  };

  useEffect(() => {
    if (!token) return;

    const loadNotifications = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [sessionRes, friendRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_BACKEND_URI}/api/session-request/incoming`,
            { headers }
          ),
          axios.get(
            `${import.meta.env.VITE_BACKEND_URI}/api/friends/incoming`,
            { headers }
          ),
        ]);

        const sessionNotifs = sessionRes.data.map((n) => ({
          type: "session-request",
          requestId: n._id,
          senderName: n.sender?.name || "Unknown User",
          senderAvatar:
            n.sender?.avatarUrl ||
            "https://avatar.iran.liara.run/public",
          createdAt: n.createdAt,
          seen: true
        }));

        const friendNotifs = friendRes.data.map((n) => ({
          type: "friend-request",
          requestId: n._id,
          senderName: n.sender?.name || "Unknown User",
          senderAvatar:
            n.sender?.avatarUrl ||
            "https://avatar.iran.liara.run/public",
          createdAt: n.createdAt,
          seen: true
        }));

        setNotifications((prev) => {
          const map = new Map();

          [...prev, ...sessionNotifs, ...friendNotifs].forEach((n) => {
            map.set(`${n.type}-${n.requestId}`, n);
          });

          return [...map.values()].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        });
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    };

    loadNotifications();
  }, [token]);

 
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);


  const unseenCount = notifications.filter((n) => !n.seen).length;

 
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition"
      >
        <Bell className="w-5 h-5" />

        {unseenCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center px-1">
            {unseenCount}
          </span>
        )}

      </button>

      {open && (
        <div
          className="
    absolute
    top-full mt-2

    left-1/2 -translate-x-1/2
    sm:left-auto sm:right-0 sm:translate-x-0

    w-[92vw] sm:w-96
    max-w-[420px]

    rounded-lg
    shadow-lg
    border
    z-50
    bg-white

    max-h-[70vh] sm:max-h-[400px]
    overflow-y-auto
  "
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
                className="flex gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b"
              >
                <img
                  src={n.senderAvatar}
                  alt="avatar"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full"
                />

                <div className="flex-1 min-w-0">
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

export default NotificationBell;

const renderText = (n) => {
  if (n.type === "friend-request") return "sent you a friend request";
  if (n.type === "session-request") return "sent you a session request";
  if (n.type === "session-status") {
    return n.status === "accepted"
      ? "accepted your session request"
      : "declined your session request";
  }
  return "";
};

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hrs ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
};
