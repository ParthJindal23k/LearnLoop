import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { socket } from "../socket";
import { useAuth } from "../context/AuthContext";
import { Send, Video } from "lucide-react";

const Session = () => {
  const { id } = useParams(); // sessionId
  const navigate = useNavigate();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  // =========================
  // 🔗 JOIN SESSION ROOM
  // =========================
  useEffect(() => {
    socket.emit("join-session", id);

    return () => {
      socket.off("new-message");
      socket.off("user-typing");
      socket.off("user-stop-typing");
    };
  }, [id]);

  // =========================
  // 📦 LOAD OLD MESSAGES
  // =========================
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/messages/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };

    fetchMessages();
  }, [id]);

  // =========================
  // 🔔 SOCKET LISTENERS
  // =========================
  useEffect(() => {
    socket.on("new-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("user-typing", () => setIsTyping(true));
    socket.on("user-stop-typing", () => setIsTyping(false));

    return () => {
      socket.off("new-message");
      socket.off("user-typing");
      socket.off("user-stop-typing");
    };
  }, []);

  // =========================
  // ⬇ AUTO SCROLL
  // =========================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // =========================
  // ✍️ TYPING HANDLER
  // =========================
  const handleTyping = (e) => {
    setText(e.target.value);

    socket.emit("typing", {
      sessionId: id,
      userId: user._id,
    });

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stop-typing", {
        sessionId: id,
        userId: user._id,
      });
    }, 1000);
  };

  // =========================
  // 📩 SEND TEXT MESSAGE
  // =========================
  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("send-message", {
      sessionId: id,
      senderId: user._id,
      type: "text",
      content: text,
    });

    socket.emit("stop-typing", {
      sessionId: id,
      userId: user._id,
    });

    setText("");
  };

  // =========================
  // 🎥 SEND VIDEO INVITE
  // =========================
  const startVideoCall = () => {
    socket.emit("send-message", {
      sessionId: id,
      senderId: user._id,
      type: "video-invite",
      content: {
        sessionId: id,
        senderName: user.name,
      },
    });

    setShowConfirm(false);
  };

  return (
    <div className="h-full flex flex-col bg-[#0f172a] text-white">
      {/* ================= HEADER ================= */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-gray-700 bg-[#020617]">
        <div className="flex items-center gap-3">
          <img
            src="https://avatar.iran.liara.run/public"
            className="w-10 h-10 rounded-full"
            alt="avatar"
          />
          <div>
            <p className="font-semibold">Session Partner</p>
            <p className="text-xs text-green-400">
              {isTyping ? "Typing..." : "Online"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-2 bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
        >
          <Video size={18} />
          Video
        </button>
      </div>

      {/* ================= CHAT BODY ================= */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg) => {
          const senderId =
            typeof msg.sender === "string"
              ? msg.sender
              : msg.sender?._id;

          const isMe = senderId === user._id;

          return (
            <div
              key={msg._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              {!isMe && (
                <img
                  src={
                    msg.sender?.avatarUrl ||
                    "https://avatar.iran.liara.run/public"
                  }
                  className="w-8 h-8 rounded-full mr-2 self-end"
                  alt="avatar"
                />
              )}

              <div
                className={`px-4 py-2 rounded-2xl max-w-[65%] text-sm ${
                  isMe
                    ? "bg-blue-600 rounded-br-none"
                    : "bg-gray-700 rounded-bl-none"
                }`}
              >
                {msg.type === "video-invite" ? (
                  <div
                    onClick={() => navigate(`/video/${id}/preview`)}
                    className="cursor-pointer"
                  >
                    <p className="font-semibold text-sm mb-1">
                      📹 Video Call Invitation
                    </p>
                    <p className="text-xs opacity-80 mb-2">
                      {msg.content?.senderName} invited you to a video meeting
                    </p>
                    <div className="inline-block bg-black/20 px-3 py-1 rounded text-xs underline">
                      Join Video Call
                    </div>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* ================= INPUT ================= */}
      <div className="h-16 px-4 flex items-center gap-3 border-t border-gray-700 bg-[#020617]">
        <input
          value={text}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message"
          className="flex-1 bg-gray-800 px-4 py-2 rounded-full focus:outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 p-3 rounded-full hover:bg-blue-700"
        >
          <Send size={18} />
        </button>
      </div>

      {/* ================= CONFIRM MODAL ================= */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#020617] p-6 rounded-lg w-80">
            <h3 className="text-lg font-semibold mb-3">
              Start Video Call?
            </h3>
            <p className="text-sm text-gray-400 mb-5">
              A video call link will be sent in chat.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded bg-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={startVideoCall}
                className="px-4 py-2 rounded bg-blue-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Session;
