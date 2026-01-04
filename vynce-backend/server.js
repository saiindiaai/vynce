// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./src/config/db");
const startExpiryJob = require("./src/cron/expireInventory");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*", // lock later when deploying
    credentials: false,
  })
);

// connect DB
connectDB();

startExpiryJob();

// routes
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const themeRoutes = require("./src/routes/themeRoutes");
const reportRoutes = require("./src/routes/reportRoutes"); // ⭐ NEW
const storeRoutes = require("./src/routes/storeRoutes");
const achievementRoutes = require("./src/routes/achievementRoutes");
const economyRoutes = require("./src/routes/economyRoutes");
const inventoryRoutes = require("./src/routes/inventoryRoutes");
const houseRoutes = require("./src/routes/houseRoutes");
const socialChatRoutes = require("./src/routes/socialChatRoutes");

app.use("/api/inventory", inventoryRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/economy", economyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/themes", themeRoutes);
app.use("/api/reports", reportRoutes); // ⭐ NEW
app.use("/api/social/posts", require("./src/social/routes/postRoutes"));
app.use("/api/social/drops", require("./src/social/routes/dropRoutes"));
app.use("/api/houses", houseRoutes);
app.use("/api/social/chat", socialChatRoutes);


// Socket.IO setup
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // House Chat
  socket.on("join-house-channel", (data) => {
    const { houseId, channelId, userId } = data;
    socket.join(`house-${houseId}-channel-${channelId}`);
    console.log(`User ${userId} joined house ${houseId} channel ${channelId}`);
  });

  socket.on("leave-house-channel", (data) => {
    const { houseId, channelId } = data;
    socket.leave(`house-${houseId}-channel-${channelId}`);
  });

  socket.on("send-house-message", (data) => {
    const { houseId, channelId, message } = data;
    io.to(`house-${houseId}-channel-${channelId}`).emit("new-house-message", message);
  });

  // Social Chat
  socket.on("join-user-room", (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("send-social-message", (data) => {
    const { toUserId, message } = data;
    io.to(`user-${toUserId}`).emit("new-social-message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// root endpoint
app.get("/", (req, res) => {
  res.json({ status: "Vynce backend up" });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(` ^z  Backend running on port ${PORT}`);
});
