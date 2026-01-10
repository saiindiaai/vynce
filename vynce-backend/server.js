// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const connectDB = require("./src/config/db");
const startExpiryJob = require("./src/cron/expireInventory");
const House = require("./src/models/House");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Socket authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token || socket.handshake.query.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id || decoded._id || decoded.uid;
    if (!socket.userId) {
      return next(new Error("Invalid token"));
    }
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
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

const notificationRoutes = require("./src/routes/notificationRoutes");

const exploreRoutes = require("./src/social/routes/exploreRoutes");

const forYouRoutes = require("./src/social/routes/forYouRoutes");
const categoriesRoutes = require("./src/social/routes/categoriesRoutes");

const creatorRoutes = require("./src/routes/creatorRoutes");


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
app.use("/api/social/capsules", require("./src/social/routes/capsuleRoutes"));
app.use("/api/social/explore", exploreRoutes);
app.use("/api/social/explore", forYouRoutes);
app.use("/api/social/explore", categoriesRoutes);
app.use("/api/houses", houseRoutes);
app.use("/api/social/chat", socialChatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/creator", creatorRoutes);


// Socket.IO setup
io.on("connection", (socket) => {
  console.log("User connected:", socket.id, "UserId:", socket.userId);

  // House Chat
  socket.on("join-house-channel", async (data) => {
    const { houseId, channelId } = data;
    const userId = socket.userId;

    try {
      const house = await House.findById(houseId);
      if (!house) {
        socket.emit("error", { message: "House not found" });
        return;
      }

      const isCreator = String(house.foundedBy) === String(userId);
      const isApprovedMember = house.members.some(id => String(id) === String(userId));

      console.log("HOUSE CREATOR:", house.foundedBy);
      console.log("REQUEST USER:", userId);
      console.log("IS CREATOR:", isCreator);
      console.log("IS APPROVED MEMBER:", isApprovedMember);
      console.log("PENDING MEMBERS:", house.pendingMembers);

      if (!isCreator && !isApprovedMember) {
        console.warn("Blocked socket join for non-member", {
          userId: userId,
          houseId: houseId
        });
        socket.emit("error", { message: "You are not allowed to access this chat" });
        return;
      }

      socket.join(`house-${houseId}-channel-${channelId}`);
      console.log(`User ${userId} joined house ${houseId} channel ${channelId}`);
    } catch (error) {
      socket.emit("error", { message: "Server error" });
    }
  });

  socket.on("leave-house-channel", (data) => {
    const { houseId, channelId } = data;
    socket.leave(`house-${houseId}-channel-${channelId}`);
  });

  socket.on("send-house-message", async (data) => {
    const { houseId, channelId, message } = data;
    const userId = socket.userId;

    try {
      const house = await House.findById(houseId);
      if (!house) {
        socket.emit("error", { message: "House not found" });
        return;
      }

      const isCreator = String(house.foundedBy) === String(userId);
      const isApprovedMember = house.members.some(id => String(id) === String(userId));

      console.log("HOUSE CREATOR:", house.foundedBy);
      console.log("REQUEST USER:", userId);
      console.log("IS CREATOR:", isCreator);
      console.log("IS APPROVED MEMBER:", isApprovedMember);
      console.log("PENDING MEMBERS:", house.pendingMembers);

      if (!isCreator && !isApprovedMember) {
        console.warn("Blocked socket send for non-member", {
          userId: userId,
          houseId: houseId
        });
        socket.emit("error", { message: "You are not allowed to access this chat" });
        return;
      }

      io.to(`house-${houseId}-channel-${channelId}`).emit("new-house-message", message);
    } catch (error) {
      socket.emit("error", { message: "Server error" });
    }
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
