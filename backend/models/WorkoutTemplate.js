const mongoose = require('mongoose');

const workoutTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a template name'],
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  category: {
    type: String,
    enum: ['cardio', 'strength', 'flexibility', 'sports', 'mixed'],
    required: true,
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  estimatedCalories: {
    type: Number,
    required: true,
  },
  exercises: [{
    name: String,
    sets: Number,
    reps: String,
    duration: Number,
    notes: String,
  }],
  isPublic: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  tags: [String],
}, {
  timestamps: true,
});

module.exports = mongoose.model('WorkoutTemplate', workoutTemplateSchema);
