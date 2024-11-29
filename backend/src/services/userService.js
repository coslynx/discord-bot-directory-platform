const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Types } = require('mongoose');

const userService = {
  findUserById: async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },

  findUserByUsername: async (username) => {
    const user = await User.findOne({ username });
    return user;
  },

  comparePassword: async (candidatePassword, hashedPassword) => {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  },

  createUser: async (userData) => {
    const newUser = new User(userData);
    await newUser.save();
    return newUser;
  },

  updateProfile: async (userId, userData, file) => {
    const updates = { ...userData };
    if (file) {
      updates.profileImageUrl = `/uploads/${file.filename}`;
    }
    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return updatedUser;
  },

  
};

module.exports = userService;
```