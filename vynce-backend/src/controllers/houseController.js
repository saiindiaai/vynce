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

    res.status(201).json(house);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all houses
exports.getHouses = async (req, res) => {
  try {
    const houses = await House.find().populate("foundedBy", "username").populate("channels");
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
    const { content } = req.body;
    const userId = req.userId;
    const { houseId, channelId } = req.params;

    const user = await User.findById(userId);

    const message = new HouseMessage({
      houseId,
      channelId,
      userId,
      userName: user.username,
      content,
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
    const messages = await HouseMessage.find({
      houseId: req.params.houseId,
      channelId: req.params.channelId,
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};