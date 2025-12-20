import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { MoreVertical, BookOpen, Users, Video, ArrowRight, Clock } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchSessions = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/session-request/active`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setSessions(res.data);
      } catch (err) {
        console.error("Failed to load sessions", err);
      }
    };

    fetchSessions();
  }, [user]);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const terminateSession = async (sessionId) => {
    if (!confirm("Are you sure you want to terminate this session?")) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/session-request/terminate`,
        { sessionId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSessions((prev) => prev.filter((s) => s._id !== sessionId));
    } catch (err) {
      alert("Failed to terminate session");
    }
  };

  const sendFriendRequest = async (userId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/friends/send`,
        { receiverId: userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Friend request sent");
    } catch (err) {
      alert("Failed to send friend request");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-3 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Welcome back, {user.name}
          </h1>
          <p className="text-gray-500">Here's what's happening with your learning sessions today</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* SKILLS OVERVIEW */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* LEARNING SKILLS */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Learning</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {user.learnSkills.length} {user.learnSkills.length === 1 ? 'Skill' : 'Skills'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.learnSkills.length > 0 ? (
                user.learnSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No skills added</p>
              )}
            </div>
          </div>

          {/* TEACHING SKILLS */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Teaching</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {user.teachSkills.length} {user.teachSkills.length === 1 ? 'Skill' : 'Skills'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.teachSkills.length > 0 ? (
                user.teachSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No skills added</p>
              )}
            </div>
          </div>
        </div>

        {/* ACTIVE SESSIONS */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Active Sessions</h2>
              <p className="text-sm text-gray-500 mt-1">{sessions.length} active session{sessions.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {sessions.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No active sessions</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Start connecting with other learners to begin your first session
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session) => {
                const otherUser =
                  session.sender._id === user._id
                    ? session.receiver
                    : session.sender;

                const isTeaching = session.sender._id === user._id;

                return (
                  <div
                    key={session._id}
                    className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                  >
                    {/* CARD HEADER */}
                    <div className="p-5 border-b border-gray-100">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={otherUser.avatarUrl}
                              alt={otherUser.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{otherUser.name}</p>
                            <p className="text-sm text-gray-500">
                              {isTeaching ? "Student" : "Instructor"}
                            </p>
                          </div>
                        </div>

                        {/* MENU */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === session._id ? null : session._id
                              )
                            }
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical size={18} className="text-gray-500" />
                          </button>

                          {openMenuId === session._id && (
                            <div
                              ref={menuRef}
                              className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1"
                            >
                              <button
                                onClick={() => sendFriendRequest(otherUser._id)}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                Add Friend
                              </button>
                              <div className="border-t border-gray-100"></div>
                              <button
                                onClick={() => terminateSession(session._id)}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                End Session
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* CARD BODY */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {session.skillRequested}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isTeaching 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-blue-50 text-blue-700'
                        }`}>
                          {isTeaching ? 'Teaching' : 'Learning'}
                        </span>
                      </div>

                      <button
                        onClick={() => navigate(`/session/${session._id}`)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Video className="w-4 h-4" />
                        Join Session
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;