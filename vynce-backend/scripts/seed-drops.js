const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Drop = require("../src/social/models/Drop");
const User = require("../src/models/User");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const seedDrops = async () => {
  try {
    // Get a user to use as author
    const user = await User.findOne();
    if (!user) {
      console.log("No users found. Please create a user first.");
      return;
    }

    const drops = [
      {
        author: user._id,
        content: "New AI breakthrough just dropped! This changes everything 🤯",
      },
      {
        author: user._id,
        content: "Color theory masterclass: Understanding contrast and harmony in modern UI design 🎨",
      },
      {
        author: user._id,
        content: "TypeScript vs JavaScript: Which should you learn first in 2025? Full breakdown 👇",
      },
      {
        author: user._id,
        content: "Behind the scenes: How we created this mind-bending animation ✨",
      },
    ];

    await Drop.insertMany(drops);
    console.log("Drops seeded successfully");
  } catch (err) {
    console.error("Error seeding drops:", err);
  }
};

const run = async () => {
  await connectDB();
  await seedDrops();
  process.exit();
};

run();