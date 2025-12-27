require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const friendRoutes = require("./routes/friend");
const messageRoutes = require("./routes/message");
const sessionRequestRoutes = require("./routes/sessionRequest");
const sessionRoutes = require("./routes/session"); 
const ratingRoutes = require("./routes/rating");


const app = express();
const server = http.createServer(app);

// =======================
// SOCKET.IO SETUP
// =======================
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URI,
      "http://localhost:5173",
      /^https:\/\/.*\.ngrok-free\.app$/,
    ],
    credentials: true,
  },
});

// online users map
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // register user
  socket.on("register-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  // disconnect
  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });

  // =======================
  // CHAT EVENTS
  // =======================
  socket.on("join-session", (sessionId) => {
    socket.join(sessionId);
  });

  socket.on("typing", ({ sessionId, userId }) => {
    socket.to(sessionId).emit("user-typing", { userId });
  });

  socket.on("stop-typing", ({ sessionId, userId }) => {
    socket.to(sessionId).emit("user-stop-typing", { userId });
  });

  socket.on("send-message", async ({ sessionId, senderId, content, type }) => {
    try {
      const Message = require("./models/Message");

      const message = await Message.create({
        sessionId,
        sender: senderId,
        type: type || "text",
        content,
      });

      io.to(sessionId).emit("new-message", {
        _id: message._id,
        sessionId,
        sender: senderId,
        type: message.type,
        content: message.content,
        createdAt: message.createdAt,
      });
    } catch (err) {
      console.error("Send message error:", err);
    }
  });

  // =======================
  // VIDEO / WEBRTC EVENTS
  // =======================
  socket.on("join-video-room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("offer", ({ offer, roomId }) => {
    socket.to(roomId).emit("offer", { offer });
  });

  socket.on("answer", ({ answer, roomId }) => {
    socket.to(roomId).emit("answer", { answer });
  });

  socket.on("ice-candidate", ({ candidate, roomId }) => {
    socket.to(roomId).emit("ice-candidate", { candidate });
  });
});

// expose socket to controllers
app.set("io", io);
app.set("onlineUsers", onlineUsers);

// =======================
// MIDDLEWARE
// =======================
app.use(cors());
app.use(express.json());

// =======================
// ROUTES
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/messages", messageRoutes);

// 🔹 session request (ask / accept / decline)
app.use("/api/session-request", sessionRequestRoutes);

// 🔹 actual sessions (start / active / terminate)
app.use("/api/session", sessionRoutes);

app.use("/api/ratings", ratingRoutes);


// =======================
app.get("/", (req, res) => {
  res.send("SkillSwap Backend Running...");
});

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 5000;

connectDB();

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server };
