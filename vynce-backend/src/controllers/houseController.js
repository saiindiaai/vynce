const House = require("../models/House");
const Channel = require("../models/Channel");
const HouseMessage = require("../models/HouseMessage");
const User = require("../models/User");
const Notification = require("../models/Notification");

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
      members: [userId],
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
    const populatedHouse = await House.findById(house._id).populate('channels');

    res.status(201).json(populatedHouse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all houses
exports.getHouses = async (req, res) => {
  try {
    const userId = req.userId;
    const houses = await House.find({
      $or: [
        { foundedBy: userId },
        { members: userId }
      ]
    }).populate("foundedBy", "username").populate("channels");
    res.json(houses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search houses globally
exports.searchHouses = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json([]);
    }

    const houses = await House.find({
      isPrivate: false,
      name: { $regex: q, $options: 'i' }
    })
      .populate("foundedBy", "username")
      .limit(20)
      .select('name level members influence type description');

    // Add member count
    const housesWithCount = houses.map(house => ({
      ...house.toObject(),
      memberCount: house.members.length
    }));

    res.json(housesWithCount);
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

// Join a house
exports.joinHouse = async (req, res) => {
  try {
    const userId = req.userId;
    const houseId = req.params.houseId;

    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    // Check if already a member
    if (house.members.some(id => String(id) === String(userId))) {
      return res.status(400).json({ message: "Already a member of this house" });
    }

    // Check if request already pending
    if (house.pendingMembers.some(id => String(id) === String(userId))) {
      return res.status(400).json({ message: "Join request already pending" });
    }

    // Add to pending members
    house.pendingMembers.push(userId);
    await house.save();

    // Notify house creator
    const requester = await User.findById(userId);
    await Notification.create({
      user: house.foundedBy,
      type: "HOUSE_JOIN_REQUEST",
      title: "House join request",
      message: `${requester.username} requested to join your house`,
      metadata: { houseId: house._id, requesterId: userId },
      priority: "HIGH",
      pinned: true,
    });

    res.status(200).json({ message: "Join request sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve a member
exports.approveMember = async (req, res) => {
  try {
    const adminId = req.userId;
    const houseId = req.params.houseId;
    const { userId } = req.body; // User to approve

    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    // Only creator can approve
    if (String(house.foundedBy) !== String(adminId)) {
      return res.status(403).json({ error: "Only the house creator can approve members" });
    }

    // Check if user is in pending
    const pendingIndex = house.pendingMembers.findIndex(id => String(id) === String(userId));
    if (pendingIndex === -1) {
      return res.status(400).json({ message: "User not in pending members" });
    }

    // Move from pending to members
    house.pendingMembers.splice(pendingIndex, 1);
    house.members.push(userId);
    await house.save();

    // Notify the approved user
    const approver = await User.findById(adminId);
    await Notification.create({
      user: userId,
      type: "HOUSE_JOIN_APPROVED",
      title: "House join approved",
      message: `${approver.username} approved your join request for house "${house.name}"`,
      metadata: { houseId: house._id, approverId: adminId },
      priority: "HIGH",
      pinned: true,
    });

    res.status(200).json({ message: "Member approved successfully" });
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

    // Fetch the house to check permissions
    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    const isCreator = String(house.foundedBy) === String(userId);
    const isApprovedMember = house.members.some(id => String(id) === String(userId));

    console.log("HOUSE CREATOR:", house.foundedBy);
    console.log("REQUEST USER:", userId);
    console.log("IS CREATOR:", isCreator);
    console.log("IS APPROVED MEMBER:", isApprovedMember);
    console.log("PENDING MEMBERS:", house.pendingMembers);

    // Only creator can create channels
    if (!isCreator && !isApprovedMember) {
      console.warn("Blocked channel creation for non-member", {
        userId: userId,
        houseId: houseId
      });
      return res.status(403).json({
        error: "You are not allowed to access this chat"
      });
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
    const userId = req.userId;
    const houseId = req.params.houseId;

    // Fetch the house to check permissions
    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    const isCreator = String(house.foundedBy) === String(userId);
    const isApprovedMember = house.members.some(id => String(id) === String(userId));

    console.log("HOUSE CREATOR:", house.foundedBy);
    console.log("REQUEST USER:", userId);
    console.log("IS CREATOR:", isCreator);
    console.log("IS APPROVED MEMBER:", isApprovedMember);
    console.log("PENDING MEMBERS:", house.pendingMembers);

    // Only creator and approved members can access channels
    if (!isCreator && !isApprovedMember) {
      console.warn("Blocked channels fetch for non-member", {
        userId: userId,
        houseId: houseId
      });
      return res.status(403).json({
        error: "You are not allowed to access this chat"
      });
    }

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

    // Fetch the house to check permissions
    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    const isCreator = String(house.foundedBy) === String(userId);
    const isApprovedMember = house.members.some(id => String(id) === String(userId));

    console.log("HOUSE CREATOR:", house.foundedBy);
    console.log("REQUEST USER:", userId);
    console.log("IS CREATOR:", isCreator);
    console.log("IS APPROVED MEMBER:", isApprovedMember);
    console.log("PENDING MEMBERS:", house.pendingMembers);

    // Only creator and approved members can send messages
    if (!isCreator && !isApprovedMember) {
      console.warn("Blocked chat send for non-member", {
        userId: userId,
        houseId: houseId
      });
      return res.status(403).json({
        error: "You are not allowed to access this chat"
      });
    }

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
    const userId = req.userId;
    const { houseId, channelId } = req.params;

    // Fetch the house to check permissions
    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    const isCreator = String(house.foundedBy) === String(userId);
    const isApprovedMember = house.members.some(id => String(id) === String(userId));

    console.log("HOUSE CREATOR:", house.foundedBy);
    console.log("REQUEST USER:", userId);
    console.log("IS CREATOR:", isCreator);
    console.log("IS APPROVED MEMBER:", isApprovedMember);
    console.log("PENDING MEMBERS:", house.pendingMembers);

    // Only creator and approved members can fetch messages
    if (!isCreator && !isApprovedMember) {
      console.warn("Blocked chat fetch for non-member", {
        userId: userId,
        houseId: houseId
      });
      return res.status(403).json({
        error: "You are not allowed to access this chat"
      });
    }

    const messages = await HouseMessage.find({
      houseId: req.params.houseId,
      channelId: req.params.channelId,
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};