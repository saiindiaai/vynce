const House = require("../models/House");
const Channel = require("../models/Channel");
const HouseMessage = require("../models/HouseMessage");
const User = require("../models/User");
const Notification = require("../models/Notification");
const Report = require("../models/Report");

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
    }).populate("foundedBy", "username").populate("members", "username").populate("channels");
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
      .populate("foundedBy", "username _id")
      .limit(20)
      .lean();

    // Add member count and ensure foundedBy is present
    const housesWithCount = houses.map(house => ({
      ...house,
      memberCount: Array.isArray(house.members) ? house.members.length : 0,
      foundedBy: house.foundedBy || { _id: null, username: 'Unknown' }
    }));

    res.json(housesWithCount);
  } catch (error) {
    console.error("Search houses error:", error);
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
    console.log("Creating notification for house creator:", house.foundedBy);
    console.log("Requester:", requester.username);
    const notification = await Notification.create({
      user: house.foundedBy,
      type: "HOUSE_JOIN_REQUEST",
      title: "House join request",
      message: `${requester.username} has requested to join your house`,
      metadata: { houseId: house._id, requesterId: userId },
      priority: "HIGH",
      pinned: true,
    });
    console.log("Notification created:", notification._id);

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

// Reject a member
exports.rejectMember = async (req, res) => {
  try {
    const adminId = req.userId;
    const houseId = req.params.houseId;
    const { userId } = req.body; // User to reject

    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    // Only creator can reject
    if (String(house.foundedBy) !== String(adminId)) {
      return res.status(403).json({ error: "Only the house creator can reject members" });
    }

    // Check if user is in pending
    const pendingIndex = house.pendingMembers.findIndex(id => String(id) === String(userId));
    if (pendingIndex === -1) {
      return res.status(400).json({ message: "User not in pending members" });
    }

    // Remove from pending members
    house.pendingMembers.splice(pendingIndex, 1);
    await house.save();

    // Notify the rejected user
    const rejector = await User.findById(adminId);
    await Notification.create({
      user: userId,
      type: "HOUSE_JOIN_REJECTED",
      title: "House join rejected",
      message: `${rejector.username} rejected your join request for house "${house.name}"`,
      metadata: { houseId: house._id, rejectorId: adminId },
      priority: "NORMAL",
      pinned: false,
    });

    res.status(200).json({ message: "Member rejected successfully" });
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
    const { content, replyTo } = req.body;
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
      replyTo: replyTo || null,
    });

    await message.save();

    // Populate replyTo for the response
    const populatedMessage = await HouseMessage.findById(message._id).populate('replyTo', 'userName content');

    res.status(201).json(populatedMessage);
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
    }).populate('replyTo', 'userName content').sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Leave a house
exports.leaveHouse = async (req, res) => {
  try {
    const userId = req.userId;
    const houseId = req.params.houseId;
    const house = await House.findById(houseId);
    if (!house) return res.status(404).json({ message: "House not found" });

    const memberIndex = house.members.findIndex(id => String(id) === String(userId));
    if (memberIndex === -1) return res.status(400).json({ message: "Not a member" });

    house.members.splice(memberIndex, 1);
    await house.save();

    // Notify founder
    await Notification.create({
      user: house.foundedBy,
      type: "HOUSE_MEMBER_LEFT",
      title: "Member left",
      message: `A member left your house ${house.name}`,
      metadata: { houseId: house._id, userId },
      priority: "NORMAL",
    });

    res.json({ message: "Left house" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle mute for current user
exports.toggleMute = async (req, res) => {
  try {
    const userId = req.userId;
    const houseId = req.params.houseId;
    const house = await House.findById(houseId);
    if (!house) return res.status(404).json({ message: "House not found" });

    const idx = house.mutedBy.findIndex(id => String(id) === String(userId));
    let muted;
    if (idx === -1) {
      house.mutedBy.push(userId);
      muted = true;
    } else {
      house.mutedBy.splice(idx, 1);
      muted = false;
    }
    await house.save();
    res.json({ muted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Report a house
exports.reportHouse = async (req, res) => {
  try {
    const userId = req.userId;
    const houseId = req.params.houseId;
    const { reason } = req.body;
    const house = await House.findById(houseId);
    if (!house) return res.status(404).json({ message: "House not found" });

    const report = await Report.create({ houseId, reportedBy: userId, reason });

    // Notify admins or moderation queue (simplified)
    await Notification.create({
      user: house.foundedBy,
      type: "HOUSE_REPORTED",
      title: "House reported",
      message: `Your house \"${house.name}\" was reported`,
      metadata: { houseId, reportId: report._id },
      priority: "HIGH",
    });

    res.json({ message: "Report submitted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit house (creator only)
exports.editHouse = async (req, res) => {
  try {
    const userId = req.userId;
    const houseId = req.params.houseId;
    const updates = req.body;

    const house = await House.findById(houseId);
    if (!house) return res.status(404).json({ message: "House not found" });
    if (String(house.foundedBy) !== String(userId)) return res.status(403).json({ message: "Only creator can edit" });

    Object.assign(house, updates);
    await house.save();
    res.json(house);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete house (creator only)
exports.deleteHouse = async (req, res) => {
  try {
    const userId = req.userId;
    const houseId = req.params.houseId;
    const house = await House.findById(houseId);
    if (!house) return res.status(404).json({ message: "House not found" });
    if (String(house.foundedBy) !== String(userId)) return res.status(403).json({ message: "Only creator can delete" });

    await House.findByIdAndDelete(houseId);
    // Note: channels/messages cleanup omitted for brevity
    res.json({ message: "House deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a member (creator only)
exports.removeMember = async (req, res) => {
  try {
    const adminId = req.userId;
    const houseId = req.params.houseId;
    const memberId = req.params.memberId;
    const house = await House.findById(houseId);
    if (!house) return res.status(404).json({ message: "House not found" });
    if (String(house.foundedBy) !== String(adminId)) return res.status(403).json({ message: "Only creator can remove members" });

    const idx = house.members.findIndex(id => String(id) === String(memberId));
    if (idx === -1) return res.status(400).json({ message: "User not a member" });
    house.members.splice(idx, 1);
    await house.save();

    await Notification.create({
      user: memberId,
      type: "HOUSE_MEMBER_REMOVED",
      title: "Removed from house",
      message: `You were removed from house \"${house.name}\"`,
      metadata: { houseId, removerId: adminId },
      priority: "HIGH",
    });

    res.json({ message: "Member removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit message
exports.editMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { houseId, channelId, messageId } = req.params;
    const { content } = req.body;

    const message = await HouseMessage.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });
    if (String(message.userId) !== String(userId)) return res.status(403).json({ message: "Can only edit your own messages" });

    message.content = content;
    message.edited = true;
    message.editedAt = new Date();
    await message.save();

    // Emit to all users in the channel
    req.io.to(`house-${houseId}-channel-${channelId}`).emit("message-edited", message);

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete message
exports.deleteMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { houseId, channelId, messageId } = req.params;

    const message = await HouseMessage.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });
    if (String(message.userId) !== String(userId)) return res.status(403).json({ message: "Can only delete your own messages" });

    await HouseMessage.findByIdAndDelete(messageId);

    // Emit to all users in the channel
    req.io.to(`house-${houseId}-channel-${channelId}`).emit("message-deleted", { messageId });

    res.json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add reaction to message
exports.addReaction = async (req, res) => {
  try {
    const userId = req.userId;
    const { houseId, channelId, messageId } = req.params;
    const { emoji } = req.body;

    const message = await HouseMessage.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    // Check if user already reacted with this emoji
    const existingReaction = message.reactions.find(r => String(r.userId) === String(userId) && r.emoji === emoji);
    if (existingReaction) return res.status(400).json({ message: "Already reacted with this emoji" });

    message.reactions.push({ userId, emoji });
    await message.save();

    // Emit to all users in the channel
    req.io.to(`house-${houseId}-channel-${channelId}`).emit("reaction-added", { messageId, reaction: { userId, emoji } });

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove reaction from message
exports.removeReaction = async (req, res) => {
  try {
    const userId = req.userId;
    const { houseId, channelId, messageId } = req.params;
    const { emoji } = req.body;

    const message = await HouseMessage.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    message.reactions = message.reactions.filter(r => !(String(r.userId) === String(userId) && r.emoji === emoji));
    await message.save();

    // Emit to all users in the channel
    req.io.to(`house-${houseId}-channel-${channelId}`).emit("reaction-removed", { messageId, emoji, userId });

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};