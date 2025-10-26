const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please add a goal title'],
    trim: true,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  type: {
    type: String,
    enum: ['weight_loss', 'weight_gain', 'workout_frequency', 'calories_burned', 'steps', 'custom'],
    required: true,
  },
  targetValue: {
    type: Number,
    required: [true, 'Please add a target value'],
  },
  currentValue: {
    type: Number,
    default: 0,
  },
  unit: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  targetDate: {
    type: Date,
    required: [true, 'Please add a target date'],
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'failed', 'abandoned'],
    default: 'active',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  milestones: [{
    value: Number,
    achieved: {
      type: Boolean,
      default: false,
    },
    achievedAt: Date,
  }],
  completedAt: Date,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Goal', goalSchema);
