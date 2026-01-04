const House = require("../models/House");
const Channel = require("../models/Channel");
const HouseMessage = require("../models/HouseMessage");
const User = require("../models/User");

// Create a new house
exports.createHouse = async (req, res) => {
  try {
    const { name, description, purpose, type } = req.body;
    const userId = req.userId;

    const house = new House({
      name,
      description,
      purpose,
      type,
      foundedBy: userId,
      members: [{
        user: userId,
        role: "leader",
        joinedAt: new Date(),
      }],
    });

    // Create default #general channel
    const channel = new Channel({
      houseId: house._id,
      name: "general",
      createdBy: userId,
    });

    await channel.save();
    house.channels.push(channel._id);

    await house.save();
    await house.populate('channels');

    res.status(201).json(house);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Join a house
exports.joinHouse = async (req, res) => {
  try {
    const { houseId } = req.params;
    const userId = req.userId;

    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    // Check if already a member
    const isMember = house.members.some(m => m.user.toString() === userId);
    if (isMember) {
      return res.status(400).json({ message: "Already a member" });
    }

    house.members.push({
      user: userId,
      role: "member",
      joinedAt: new Date(),
    });

    await house.save();
    await house.populate("members.user", "username");

    res.json(house);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all houses
exports.getHouses = async (req, res) => {
  try {
    const houses = await House.find().populate("foundedBy", "username").populate("channels").populate("members.user", "username");
    res.json(houses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific house
exports.getHouse = async (req, res) => {
  try {
    const house = await House.findById(req.params.houseId)
      .populate("foundedBy", "username")
      .populate("channels");
    if (!house) return res.status(404).json({ message: "House not found" });
    res.json(house);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a channel in a house
exports.createChannel = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.userId;
    const houseId = req.params.houseId;

    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    // Check if user is leader
    const member = house.members.find(m => m.user.toString() === userId);
    if (!member || member.role !== "leader") {
      return res.status(403).json({ message: "Only house leader can create channels" });
    }

    const channel = new Channel({
      houseId,
      name,
      description,
      createdBy: userId,
    });

    await channel.save();

    // Add to house
    await House.findByIdAndUpdate(houseId, { $push: { channels: channel._id } });

    res.status(201).json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get channels for a house
exports.getChannels = async (req, res) => {
  try {
    const channels = await Channel.find({ houseId: req.params.houseId });
    res.json(channels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send a message to a channel
exports.sendMessage = async (req, res) => {
  try {
    const { content, replyTo } = req.body;
    const userId = req.userId;
    const { houseId, channelId } = req.params;

    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    // Check if user is member
    const isMember = house.members.some(m => m.user.toString() === userId);
    if (!isMember) {
      return res.status(403).json({ message: "Must be a house member to send messages" });
    }

    const user = await User.findById(userId);

    const message = new HouseMessage({
      houseId,
      channelId,
      userId,
      userName: user.username,
      content,
      replyTo,
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get messages for a channel
exports.getMessages = async (req, res) => {
  try {
    const userId = req.userId;
    const { houseId } = req.params;

    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    // Check if user is member
    const isMember = house.members.some(m => m.user.toString() === userId);
    if (!isMember) {
      return res.status(403).json({ message: "Must be a house member to view messages" });
    }

    const messages = await HouseMessage.find({
      houseId,
      channelId: req.params.channelId,
    }).populate('replyTo').sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};