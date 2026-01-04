const express = require("express");
const router = express.Router();
const socialChatController = require("../controllers/socialChatController");
const auth = require("../middleware/auth");

// Conversation routes
router.get("/conversations", auth, socialChatController.getConversations);
router.post("/conversations", auth, socialChatController.createConversation);

// Message routes
router.post("/conversations/:conversationId/messages", auth, socialChatController.sendMessage);
router.get("/conversations/:conversationId/messages", auth, socialChatController.getMessages);

module.exports = router;