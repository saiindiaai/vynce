const express = require("express");
const { registerUser, loginUser, guestLogin, getMe } = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/guest", guestLogin);
router.get("/me", protect, getMe);

module.exports = router;
