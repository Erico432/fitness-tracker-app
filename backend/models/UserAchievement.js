const mongoose = require('mongoose');

const userAchievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  achievement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement',
    required: true,
  },
  unlockedAt: {
    type: Date,
    default: Date.now,
  },
  progress: {
    current: {
      type: Number,
      default: 0,
    },
    target: {
      type: Number,
      required: true,
    },
  },
  isUnlocked: {
    type: Boolean,
    default: false,
  },
});

userAchievementSchema.index({ user: 1, achievement: 1 }, { unique: true });

module.exports = mongoose.model('UserAchievement', userAchievementSchema);
