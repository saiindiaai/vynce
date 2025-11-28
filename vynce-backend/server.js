// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: '*', // later lock to your frontend domain
    credentials: false,
  })
);

// connect DB
connectDB();

// routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const themeRoutes = require('./src/routes/themeRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/themes', themeRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'Vynce backend up' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`⚡ Backend running on port ${PORT}`);
});
