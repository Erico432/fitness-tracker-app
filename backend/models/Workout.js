const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  exerciseName: {
    type: String,
    required: [true, 'Please add an exercise name'],
    trim: true,
  },
  category: {
    type: String,
    enum: ['cardio', 'strength', 'flexibility', 'sports', 'other'],
    default: 'other',
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Please add duration'],
    min: 1,
  },
  caloriesBurned: {
    type: Number,
    required: [true, 'Please add calories burned'],
    min: 0,
  },
  intensity: {
    type: String,
    enum: ['low', 'moderate', 'high'],
    default: 'moderate',
  },
  notes: {
    type: String,
    maxlength: 500,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Workout', workoutSchema);
