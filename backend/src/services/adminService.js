const Bot = require('../models/bot');
const User = require('../models/user');
const {Types} = require('mongoose');

const adminService = {
  getDashboardData: async () => {
    const totalBots = await Bot.countDocuments();
    const approvedBots = await Bot.countDocuments({ status: 'approved' });
    const pendingBots = await Bot.countDocuments({ status: 'pending' });
    const rejectedBots = await Bot.countDocuments({ status: 'rejected' });
    const totalUsers = await User.countDocuments();
    return { totalBots, approvedBots, pendingBots, rejectedBots, totalUsers };
  },

  getBots: async (searchQuery, status) => {
    let query = {};
    if (searchQuery) {
      query.$text = { $search: searchQuery };
    }
    if (status) {
      query.status = status;
    }
    const bots = await Bot.find(query, { score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } });
    return bots;
  },

  getBot: async (botId) => {
      const bot = await Bot.findById(botId).populate('owner');
      if (!bot) {
          throw new Error('Bot not found');
      }
      return bot;
  },
  
  approveBot: async (botId) => {
    const bot = await Bot.findByIdAndUpdate(botId, { status: 'approved' }, { new: true }).populate('owner');
    if (!bot) {
        throw new Error('Bot not found');
    }
    return bot;
  },

  rejectBot: async (botId) => {
    const bot = await Bot.findByIdAndUpdate(botId, { status: 'rejected' }, { new: true }).populate('owner');
    if (!bot) {
        throw new Error('Bot not found');
    }
    return bot;
  },

  updateBot: async (botId, botData) => {
    const bot = await Bot.findByIdAndUpdate(botId, botData, { new: true });
    if (!bot) {
        throw new Error('Bot not found');
    }
    return bot;
  },

  deleteBot: async (botId) => {
    const bot = await Bot.findByIdAndDelete(botId);
    if (!bot) {
        throw new Error('Bot not found');
    }
  },

  getUsers: async (searchQuery, role) => {
    let query = {};
    if (searchQuery) {
      query.username = { $regex: searchQuery, $options: 'i' };
    }
    if (role) {
      query.role = role;
    }
    const users = await User.find(query);
    return users;
  },

  getUser: async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
  },

  updateUser: async (userId, userData) => {
    const user = await User.findByIdAndUpdate(userId, userData, { new: true });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
  },

  deleteUser: async (userId) => {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        throw new Error('User not found');
    }
  },

};

module.exports = adminService;
```