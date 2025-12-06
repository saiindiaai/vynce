// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');
const startExpiryJob = require('./src/cron/expireInventory');

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: '*', // lock later when deploying
    credentials: false,
  })
);

// connect DB
connectDB();

startExpiryJob();

// routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const themeRoutes = require('./src/routes/themeRoutes');
const reportRoutes = require('./src/routes/reportRoutes');   // ⭐ NEW
const storeRoutes = require('./src/routes/storeRoutes');
const achievementRoutes = require('./src/routes/achievementRoutes');
const economyRoutes = require('./src/routes/economyRoutes');
const inventoryRoutes = require("./src/routes/inventoryRoutes");

app.use("/api/inventory", inventoryRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/economy', economyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/reports', reportRoutes);                        // ⭐ NEW

// root endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Vynce backend up' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(` ^z  Backend running on port ${PORT}`);
});
