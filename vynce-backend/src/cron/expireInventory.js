// src/cron/expireInventory.js
const cron = require('node-cron');
const User = require('../models/User');

// run every 15 minutes
function startExpiryJob() {
  cron.schedule('*/15 * * * *', async () => {
    try {
      const now = new Date();
      // remove expired inventory entries
      const users = await User.find({ "inventory.expiresAt": { $lte: now } });
      for (const u of users) {
        u.inventory = u.inventory.filter(it => it.permanent || (it.expiresAt && it.expiresAt > now));
        await u.save();
      }
      // console.log('Expiry job ran');
    } catch (e) {
      console.error('Expiry job error', e);
    }
  });
}

module.exports = startExpiryJob;
