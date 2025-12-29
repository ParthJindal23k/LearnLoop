import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { socket } from "../socket";
import { useAuth } from "../context/AuthContext";
import { Send, Video, ArrowLeft } from "lucide-react";
import SessionSkeleton from "../components/skeletons/SessionSkeleton";


const Session = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    socket.emit("join-session", id);
    return () => {
      socket.off("new-message");
      socket.off("user-typing");
      socket.off("user-stop-typing");
    };
  }, [id]);

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
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [id]);

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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleTyping = (e) => {
    setText(e.target.value);
    socket.emit("typing", { sessionId: id, userId: user._id });

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stop-typing", { sessionId: id, userId: user._id });
    }, 1000);
  };

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("send-message", {
      sessionId: id,
      senderId: user._id,
      type: "text",
      content: text,
    });

    socket.emit("stop-typing", { sessionId: id, userId: user._id });
    setText("");
  };

  const startVideoCall = () => {
    socket.emit("send-message", {
      sessionId: id,
      senderId: user._id,
      type: "video-invite",
      content: { sessionId: id, senderName: user.name },
    });
    setShowConfirm(false);
  };

  const partnerName = (() => {
    if (!messages.length) return "Chat";

    for (let msg of messages) {
      const sender =
        msg.sender?.name || msg.senderName || null;
      const senderId =
        msg.sender?._id || msg.sender || msg.senderId;

      if (senderId && senderId !== user._id && sender) {
        return sender;
      }
    }
    return "Chat";
  })();

  if (loading) {
    return <SessionSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#efeae2] flex justify-center sm:py-6">

      <div className="
        w-full
        sm:max-w-4xl
        bg-[#f0f2f5]
        sm:rounded-xl
        shadow-xl
        flex flex-col
        overflow-hidden
      ">
        <div className="px-3 sm:px-4 py-3 flex items-center justify-between bg-[#ededed] border-b">

          <div className="flex items-center gap-2 sm:gap-3">

            <button
              onClick={() => navigate("/dashboard")}
              className="md:hidden p-1.5 rounded-full hover:bg-gray-200"
            >
              <ArrowLeft size={20} />
            </button>

            <img
              src="https://avatar.iran.liara.run/public"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full"
              alt="avatar"
            />

            <div>
              <p className="font-medium text-gray-900 text-sm sm:text-base">
                {partnerName}
              </p>
              <p className="text-xs text-green-600">
                {isTyping ? "typing..." : "online"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            className="
      flex items-center gap-1 sm:gap-2
      text-xs sm:text-sm
      bg-green-600 hover:bg-green-700
      text-white
      px-3 py-1.5
      rounded-full
    "
          >
            <Video size={14} />
            Video
          </button>
        </div>

        <div
          className="
            flex-1 overflow-y-auto
            px-3 sm:px-6
            py-4 space-y-3
          "
          style={{
            backgroundImage:
              "url('https://www.transparenttextures.com/patterns/diagmonds-light.png')",
          }}
        >
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm">
              Start chatting 👋
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
                  className={`
                    max-w-[85%] sm:max-w-[65%]
                    px-4 py-2
                    rounded-lg
                    text-sm
                    shadow
                    ${isMe
                      ? "bg-[#d9fdd3] text-gray-900 rounded-br-none"
                      : "bg-white text-gray-900 rounded-bl-none"
                    }
                  `}
                >
                  {msg.type === "video-invite" ? (
                    <div
                      onClick={() => navigate(`/video/${id}/preview`)}
                      className="cursor-pointer"
                    >
                      <p className="font-semibold mb-1">
                        📹 Video Call Invitation
                      </p>
                      <p className="text-xs text-blue-600 underline">
                        Join video call
                      </p>
                    </div>
                  ) : (
                    msg.content
                  )}

                  <p className="text-[10px] text-gray-500 mt-1 text-right">
                    {new Date(
                      msg.createdAt || Date.now()
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        <div className="px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 bg-[#ededed] border-t">
          <input
            value={text}
            onChange={handleTyping}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message"
            className="
              flex-1 bg-white
              px-4 py-2
              rounded-full
              text-sm
              focus:outline-none
              border
            "
          />
          <button
            onClick={sendMessage}
            className="
              bg-green-600 hover:bg-green-700
              text-white
              p-2
              rounded-full
            "
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-5 sm:p-6 rounded-xl w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">
              Start video call?
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              A video call invitation will be sent.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={startVideoCall}
                className="px-4 py-2 rounded bg-green-600 text-white"
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
