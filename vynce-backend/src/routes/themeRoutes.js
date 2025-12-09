const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { setTheme } = require("../controllers/themeController");

// simple static list for now
router.get("/", (req, res) => {
  res.json({
    themes: [
      "Monochrome Royale",
      "Galaxy Core",
      "Vynce Nebula",
      "CyberMint",
      "Minimal Mono",
      "Lavender Mist",
    ],
  });
});

module.exports = router;
