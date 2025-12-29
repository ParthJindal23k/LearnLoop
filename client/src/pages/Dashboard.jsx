import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Video, ArrowRight } from "lucide-react";
import RatingModal from "../components/common/RatingModal";
import DashboardSessionCardSkeleton from "../components/skeletons/DashboardSessionCardSkeleton";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [onlineUsers, setOnlineUsers] = useState([]);


  const [showRating, setShowRating] = useState(false);
  const [ratingSessionId, setRatingSessionId] = useState(null);
  const [ratingUser, setRatingUser] = useState(null);

  const menuRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user || !token) return;

    const fetchSessions = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/session/active`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSessions(res.data);
      } catch (err) {
        console.error("Failed to load sessions", err);
      } finally {
        setLoading(false); 
      }
    };

    fetchSessions();
  }, [user, token]);



  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/users/online`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOnlineUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch online users");
      }
    };

    fetchOnlineUsers();

    const interval = setInterval(fetchOnlineUsers, 15000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (!user || !token) return;

    const checkPendingRatings = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/ratings/pending`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.length > 0) {
          const pending = res.data[0];
          setRatingSessionId(pending.sessionId);
          setRatingUser(pending.otherUser);
          setShowRating(true);
        }
      } catch (err) {
        console.error("Failed to load pending ratings", err);
      }
    };

    checkPendingRatings();
  }, [user, token]);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const terminateSession = async (session) => {
    if (!window.confirm("End this session?")) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/session/terminate`,
        { sessionId: session._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const otherUser = session.participants.find(
        (p) => p._id !== user._id
      );

      setSessions((prev) => prev.filter((s) => s._id !== session._id));
      setRatingSessionId(session._id);
      setRatingUser(otherUser);
      setShowRating(true);
    } catch {
      toast.error("Failed to terminate session");
    }
  };

  const sendFriendRequest = async (userId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/friends/request`,
        { receiverId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Friend request sent");
    } catch {
      toast.error("Friend request failed");
    }
  };


  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;

    return `${Math.floor(diff / 86400)} days ago`;
  };


  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <RatingModal
        open={showRating}
        otherUser={ratingUser}
        onClose={() => setShowRating(false)}
        onSubmit={async (rating, feedback) => {
          try {
            await axios.post(
              `${import.meta.env.VITE_BACKEND_URI}/api/ratings`,
              {
                sessionId: ratingSessionId,
                ratedUserId: ratingUser._id,
                score: rating,
                feedback,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setShowRating(false);
          } catch {
            toast.error("Failed to submit rating");
          }
        }}
      />

      <div className="bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Continue your active learning sessions
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <DashboardSessionCardSkeleton key={i} />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          
          <div className="bg-white rounded-2xl border p-16 text-center shadow-sm">
            <Video className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500 text-lg">No active sessions</p>
          </div>
        ) : (
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sessions.map((session) => {
              const otherUser = session.participants.find(
                (p) => p._id !== user._id
              );

              return (
                <div
                  key={session._id}
                  className="bg-white rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  
                  <div className="p-6 flex justify-between items-center border-b">
                    <div className="flex items-center gap-4">
                      <img
                        src={otherUser?.avatarUrl || "/default-avatar.png"}
                        alt={otherUser?.name}
                        className="w-14 h-14 rounded-full ring-2 ring-blue-500"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">
                          {otherUser?.name}
                        </p>
                        {onlineUsers.includes(otherUser._id) ? (
                          <p className="text-sm text-green-600 font-medium flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                            Active now
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">
                            Last active {timeAgo(otherUser.lastSeen)}
                          </p>
                        )}

                      </div>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === session._id ? null : session._id
                          )
                        }
                        className="p-2 rounded-lg hover:bg-gray-100"
                      >
                        <MoreVertical />
                      </button>

                      {openMenuId === session._id && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-xl"
                        >
                          <button
                            onClick={() => sendFriendRequest(otherUser._id)}
                            className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
                          >
                            🤝 Add Friend
                          </button>
                          <button
                            onClick={() => terminateSession(session)}
                            className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
                          >
                            ❌ End Session
                          </button>
                        </div>
                      )}
                    </div>
                  </div>


                  <div className="p-6">
                    <button
                      onClick={() => navigate(`/session/${session._id}`)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                    >
                      <Video size={18} />
                      Join Session
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
