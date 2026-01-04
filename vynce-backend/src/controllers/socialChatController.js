const Conversation = require("../models/Conversation");
const SocialMessage = require("../models/SocialMessage");
const User = require("../models/User");

// Get conversations for a user
exports.getConversations = async (req, res) => {
  try {
    const userId = req.userId;
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "username")
      .populate("lastMessage")
      .sort({ lastMessageTime: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new conversation
exports.createConversation = async (req, res) => {
  try {
    const { participantId } = req.body;
    const userId = req.userId;

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      participants: { $all: [userId, participantId] },
    });

    if (existingConversation) {
      return res.json(existingConversation);
    }

    const conversation = new Conversation({
      participants: [userId, participantId],
    });

    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send a message in a conversation
exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.userId;
    const { conversationId } = req.params;

    const user = await User.findById(userId);

    const message = new SocialMessage({
      conversationId,
      senderId: userId,
      senderName: user.username,
      content,
    });

    await message.save();

    // Update conversation's last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      lastMessageTime: message.timestamp,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get messages for a conversation
exports.getMessages = async (req, res) => {
  try {
    const messages = await SocialMessage.find({
      conversationId: req.params.conversationId,
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};