const mongoose = require('mongoose');

const botSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
    required: true,
  },
  githubUrl: {
    type: String,
  },
  websiteUrl: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  guildCount: {
    type: Number,
    default: 0,
  },
  userCount: {
    type: Number,
    default: 0,
  },
  uptimePercentage: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


botSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Bot', botSchema);
```