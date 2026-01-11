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
      .populate("participants", "username _id")
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
    })
      .populate("participants", "username displayName _id")
      .populate("lastMessage");

    if (existingConversation) {
      return res.json(existingConversation);
    }

    const conversation = new Conversation({
      participants: [userId, participantId],
    });

    await conversation.save();

    // Populate the participants before returning
    await conversation.populate("participants", "username displayName _id");

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

// Edit a message
exports.editMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.userId;
    const { messageId } = req.params;

    const message = await SocialMessage.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.senderId.toString() !== userId) {
      return res.status(403).json({ message: "You can only edit your own messages" });
    }

    message.content = content;
    message.edited = true;
    message.editedAt = new Date();
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { messageId } = req.params;

    const message = await SocialMessage.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.senderId.toString() !== userId) {
      return res.status(403).json({ message: "You can only delete your own messages" });
    }

    await SocialMessage.findByIdAndDelete(messageId);

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// React to a message
exports.reactToMessage = async (req, res) => {
  try {
    const { emoji } = req.body;
    const userId = req.userId;
    const { messageId } = req.params;

    const user = await User.findById(userId);

    const message = await SocialMessage.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check if user already reacted with this emoji
    const existingReaction = message.reactions?.find(r => r.by.toString() === userId && r.type === emoji);

    if (existingReaction) {
      // Remove the reaction
      message.reactions = message.reactions.filter(r => !(r.by.toString() === userId && r.type === emoji));
    } else {
      // Add the reaction
      if (!message.reactions) message.reactions = [];
      message.reactions.push({
        type: emoji,
        by: userId,
        byName: user.username
      });
    }

    await message.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};