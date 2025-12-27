import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Video, ArrowRight } from "lucide-react";
import RatingModal from "../components/common/RatingModal";

const Dashboard = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);

  // ⭐ Rating modal state (UNCHANGED)
  const [showRating, setShowRating] = useState(false);
  const [ratingSessionId, setRatingSessionId] = useState(null);
  const [ratingUser, setRatingUser] = useState(null);

  const menuRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // =========================
  // LOAD ACTIVE SESSIONS (UNCHANGED)
  // =========================
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
      }
    };

    fetchSessions();
  }, [user, token]);

  // =========================
  // CHECK PENDING RATINGS (UNCHANGED)
  // =========================
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

  // =========================
  // CLOSE MENU ON OUTSIDE CLICK (UNCHANGED)
  // =========================
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // =========================
  // TERMINATE SESSION (UNCHANGED)
  // =========================
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
      alert("Failed to terminate session");
    }
  };

  // =========================
  // SEND FRIEND REQUEST (UNCHANGED)
  // =========================
  const sendFriendRequest = async (userId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/friends/request`,
        { receiverId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Friend request sent");
    } catch {
      alert("Friend request failed");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* ⭐ RATING MODAL */}
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
            alert("Failed to submit rating");
          }
        }}
      />

      {/* HEADER */}
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

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {sessions.length === 0 ? (
          <div className="bg-white rounded-2xl border p-16 text-center shadow-sm animate-fade-in">
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
                  {/* CARD HEADER */}
                  <div className="p-6 flex justify-between items-center border-b">
                    <div className="flex items-center gap-4">
                      <img
                        src={otherUser?.avatarUrl || "/default-avatar.png"}
                        alt={otherUser?.name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-500"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">
                          {otherUser?.name}
                        </p>
                        <p className="text-sm text-green-600 font-medium">
                          ● Active now
                        </p>
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === session._id ? null : session._id
                          )
                        }
                        className="p-2 rounded-lg hover:bg-gray-100 transition"
                      >
                        <MoreVertical />
                      </button>

                      {openMenuId === session._id && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-xl overflow-hidden animate-scale-in"
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

                  {/* CARD BODY */}
                  <div className="p-6">
                    <button
                      onClick={() => navigate(`/session/${session._id}`)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
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
