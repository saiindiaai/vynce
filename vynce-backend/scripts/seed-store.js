// scripts/seed-store.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const StoreItem = require("../src/models/StoreItem");
const Achievement = require("../src/models/Achievement");
const connectDB = require("../src/config/db");

(async () => {
  await connectDB();
  await StoreItem.deleteMany({});
  await Achievement.deleteMany({});

  await StoreItem.create([
    {
      key: "monochrome_theme",
      name: "Monochrome Royale Theme",
      type: "theme",
      priceEnergy: 50,
      priceCelestium: 200,
      durationHours: 48,
    },
    {
      key: "galaxy_core_theme",
      name: "Galaxy Core Theme",
      type: "theme",
      priceEnergy: 80,
      priceCelestium: 300,
      durationHours: 48,
    },
  ]);

  await Achievement.create([
    {
      key: "first_login",
      title: "First Login",
      rewardXP: 50,
      rewardEnergy: 50,
      rewardCelestium: 10,
      rewardBadge: "first_login_badge",
    },
    {
      key: "complete_onboarding",
      title: "Onboarded",
      rewardXP: 100,
      rewardEnergy: 100,
      rewardCelestium: 25,
      rewardBadge: "onboarded_badge",
    },
  ]);

  console.log("Seed done");
  process.exit(0);
})();
