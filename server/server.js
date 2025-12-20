require("dotenv").config();

const express = require("express")
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const cors = require("cors");
const server = http.createServer(app);
const messageRoutes = require("./routes/message");
const friendRoutes = require("./routes/friend")


const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URI, 
    credentials: true,
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });

  socket.on("join-session", (sessionId) => {
  socket.join(sessionId);
});

socket.on("typing", ({ sessionId, userId }) => {
  socket.to(sessionId).emit("user-typing", { userId });
});

socket.on("stop-typing", ({ sessionId, userId }) => {
  socket.to(sessionId).emit("user-stop-typing", { userId });
});


socket.on("send-message", async ({ sessionId, senderId, content ,type}) => {
  const Message = require("./models/Message");

  const message = await Message.create({
    sessionId,
    sender: senderId,
    type:type||"text",
    content,
  });

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

  io.to(sessionId).emit("new-message", {
    _id: message._id,
    sessionId,
    sender: senderId,
    content,
    createdAt: message.createdAt,
  });
});



});

app.set("io", io);
app.set("onlineUsers", onlineUsers);


const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const sessionRequestRoutes = require("./routes/sessionRequest");
const userRoutes = require("./routes/user");


app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/session-request", sessionRequestRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/friends" , friendRoutes)

app.get("/", (req, res) => {
  res.send("SkillSwap Backend Running...");
});

const PORT = process.env.PORT || 5000;

connectDB();

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = {app,server};
