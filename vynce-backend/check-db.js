const mongoose = require('mongoose');
require('dotenv').config();

async function checkDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const User = require('./src/models/User');
    const Post = require('./src/social/models/Post');
    const Drop = require('./src/social/models/Drop');
    const Capsule = require('./src/social/models/Capsule');

    const allUsers = await User.find({});
    console.log('Total Users found:', allUsers.length);

    const allPosts = await Post.find({});
    const allDrops = await Drop.find({});
    const allCapsules = await Capsule.find({});
    console.log('Total Posts found:', allPosts.length);
    console.log('Total Drops found:', allDrops.length);
    console.log('Total Capsules found:', allCapsules.length);

    // Check if any content author matches any user
    const userIds = new Set(allUsers.map(u => u._id.toString()));

    const updateInvalidAuthors = async (Model, collectionName) => {
      const invalidItems = await Model.find({
        author: { $nin: Array.from(userIds).map(id => new mongoose.Types.ObjectId(id)) }
      });
      console.log(`${collectionName} with invalid authors: ${invalidItems.length}`);
      if (invalidItems.length > 0 && allUsers.length > 0) {
        console.log(`Updating ${invalidItems.length} ${collectionName} with invalid authors...`);
        const validUserId = allUsers[0]._id;
        const result = await Model.updateMany(
          { author: { $nin: Array.from(userIds).map(id => new mongoose.Types.ObjectId(id)) } },
          { $set: { author: validUserId } }
        );
        console.log(`${collectionName} updated successfully: ${result.modifiedCount} documents`);
      }
    };

    await updateInvalidAuthors(Post, 'Posts');
    await updateInvalidAuthors(Drop, 'Drops');
    await updateInvalidAuthors(Capsule, 'Capsules');

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkDB();