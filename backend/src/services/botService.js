const Bot = require('../models/bot');
const { Types } = require('mongoose');
const axios = require('axios');
const cron = require('node-cron');
const winston = require('winston');


const botService = {
    createBot: async (botData, userId) => {
        const newBot = new Bot({ ...botData, owner: userId });
        await newBot.save();
        return newBot;
    },

    updateBot: async (botId, botData) => {
        const updatedBot = await Bot.findByIdAndUpdate(botId, botData, { new: true });
        if (!updatedBot) {
            throw new Error('Bot not found');
        }
        return updatedBot;
    },

    deleteBot: async (botId) => {
        const deletedBot = await Bot.findByIdAndDelete(botId);
        if (!deletedBot) {
            throw new Error('Bot not found');
        }
    },

    getBot: async (botId) => {
        const bot = await Bot.findById(botId).populate('owner');
        if (!bot) {
            throw new Error('Bot not found');
        }
        return bot;
    },

    getAllBots: async () => {
        const bots = await Bot.find();
        return bots;
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


    updateBotMetrics: async () => {
        const bots = await Bot.find();
        const promises = bots.map(async (bot) => {
          try {
            const uptimeResponse = await axios.get(process.env.UPTIME_ROBOT_API_URL,{ params: {apiKey: process.env.UPTIME_ROBOT_API_KEY, monitorID: bot.monitorId}});
            const uptimePercentage = uptimeResponse.data.monitors[0].uptime;
            const guildCount = await axios.get(process.env.DISCORD_API_URL + `/applications/${bot.applicationId}/guilds`);
            const userCount = (await axios.get(process.env.DISCORD_API_URL + `/applications/${bot.applicationId}/guilds`)).data.length;
            await Bot.findByIdAndUpdate(bot._id, { uptimePercentage, guildCount: guildCount.data.length, userCount });
          } catch (error) {
            winston.error(`Error updating metrics for bot ${bot.name}: ${error.message}`);
          }
        });
        await Promise.all(promises);
      }
};

module.exports = botService;
```