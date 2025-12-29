import { useEffect, useState } from "react";
import axios from "axios";
import NotificationDetailCard from "../components/notifications/NotificationDetailCard";
import NotificationItemSkeleton from "../components/skeletons/NotificationItemSkeleton";
import NotificationDetailSkeleton from "../components/skeletons/NotificationDetailSkeleton";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const updateStatus = (id, newStatus) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === id || n.requestId === id
          ? { ...n, status: newStatus }
          : n
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
          type: "session-request",
        }));

        const friendNotifs = friendRes.data.map((n) => ({
          ...n,
          type: "friend-request",
          status: n.status || "pending",
        }));

        setNotifications(
          [...sessionNotifs, ...friendNotifs].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      } catch (err) {
        console.error("Failed to load notifications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 md:flex">
      
      <aside
        className={`
          w-full md:max-w-sm
          border-r bg-white
          overflow-y-auto
          ${selected ? "hidden md:block" : "block"}
        `}
      >
        <div className="p-4 sm:p-5 border-b">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Notifications
          </h2>
          <p className="text-sm text-gray-500">
            Requests & updates
          </p>
        </div>

        {loading ? (
          <>
            {[...Array(6)].map((_, i) => (
              <NotificationItemSkeleton key={i} />
            ))}
          </>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">
            No notifications yet
          </div>
        ) : (
          notifications.map((n) => {
            const isActive = selected?._id === n._id;

            return (
              <button
                key={`${n.type}-${n._id}`}
                onClick={() => setSelected(n)}
                className={`w-full text-left p-4 border-b transition ${
                  isActive
                    ? "bg-blue-50 border-l-4 border-l-blue-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex gap-3">
                  <img
                    src={
                      n.sender?.avatarUrl ||
                      n.senderAvatar ||
                      "https://avatar.iran.liara.run/public"
                    }
                    alt="avatar"
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {n.sender?.name || n.senderName || "Unknown User"}
                    </p>

                    <p className="text-sm text-gray-600 truncate mt-0.5">
                      {n.type === "friend-request"
                        ? "Sent you a friend request"
                        : n.type === "session-request"
                        ? "Requested a session"
                        : n.status === "accepted"
                        ? "Accepted your session request"
                        : "Declined your session request"}
                    </p>

                    <span
                      className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                        n.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : n.status === "declined"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {n.status || "pending"}
                    </span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </aside>

      <main
        className={`
          flex-1 bg-gray-50
          p-4 sm:p-6 md:p-8
          overflow-y-auto
          ${!selected ? "hidden md:block" : "block"}
        `}
      >
        {loading ? (
          <div className="max-w-2xl mx-auto">
            <NotificationDetailSkeleton />
          </div>
        ) : !selected ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-400 text-lg">
                Select a notification
              </p>
              <p className="text-sm text-gray-400 mt-1">
                View details & take action
              </p>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={() => setSelected(null)}
              className="md:hidden mb-4 text-sm text-blue-600 hover:underline"
            >
              ← Back to notifications
            </button>

            <div className="max-w-2xl mx-auto">
              <NotificationDetailCard
                notification={selected}
                onUpdate={updateStatus}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Notification;
