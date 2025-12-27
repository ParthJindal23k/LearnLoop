import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { socket } from "../socket";
import { useAuth } from "../context/AuthContext";
import { Send, Video } from "lucide-react";

const Session = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  // =========================
  // JOIN SESSION ROOM
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
  // LOAD MESSAGES
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
  // SOCKET LISTENERS
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
  // AUTO SCROLL
  // =========================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // =========================
  // TYPING HANDLER
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
  // SEND MESSAGE
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
  // VIDEO INVITE
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
      <div className="h-14 px-5 flex items-center justify-between bg-[#020617] border-b border-white/10">
        <div className="flex items-center gap-3">
          <img
            src="https://avatar.iran.liara.run/public"
            className="w-9 h-9 rounded-full"
            alt="avatar"
          />
          <div>
            <p className="text-sm font-semibold">Session Partner</p>
            <p className="text-xs text-green-400">
              {isTyping ? "Typing…" : "Online"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md text-sm"
        >
          <Video size={16} />
          Video
        </button>
      </div>

      {/* ================= CHAT ================= */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-[#0f172a]">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            <div className="text-center">
              <p className="mb-1">👋 No messages yet</p>
              <p>Start the conversation</p>
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const senderId =
            msg.sender?._id || msg.sender || msg.senderId;
          const isMe = senderId === user._id;

          return (
            <div
              key={msg._id || Math.random()}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[60%] px-4 py-2 rounded-lg text-sm ${
                  isMe
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                {msg.type === "video-invite" ? (
                  <div
                    onClick={() =>
                      navigate(`/video/${id}/preview`)
                    }
                    className="cursor-pointer"
                  >
                    <p className="font-semibold mb-1">
                      📹 Video Call Invite
                    </p>
                    <p className="text-xs opacity-80">
                      Click to join the video call
                    </p>
                  </div>
                ) : (
                  msg.content
                )}

                <p className="text-[10px] opacity-50 mt-1 text-right">
                  {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <p className="text-xs text-gray-400">typing…</p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ================= INPUT ================= */}
      <div className="h-14 px-4 flex items-center gap-3 bg-[#020617] border-t border-white/10">
        <input
          value={text}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 bg-gray-800 px-4 py-2 rounded-md text-sm focus:outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 p-2 rounded-md"
        >
          <Send size={18} />
        </button>
      </div>

      {/* ================= CONFIRM MODAL ================= */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#020617] p-6 rounded-lg w-80">
            <h3 className="text-lg font-semibold mb-2">
              Start video call?
            </h3>
            <p className="text-sm text-gray-400 mb-5">
              A video call invite will be sent.
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
