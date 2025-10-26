const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['workout', 'streak', 'milestone', 'goal', 'special'],
    default: 'workout',
  },
  requirement: {
    type: {
      type: String,
      enum: ['workout_count', 'streak_days', 'calories_burned', 'total_duration', 'category_specific', 'goal_achieved'],
    },
    value: Number,
    categoryType: String, // for category_specific achievements
  },
  points: {
    type: Number,
    default: 10,
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Achievement', achievementSchema);
