const mongoose = require('mongoose');

const healthMetricSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  steps: {
    type: Number,
    min: 0,
    default: 0,
  },
  sleepHours: {
    type: Number,
    min: 0,
    max: 24,
  },
  waterIntake: {
    type: Number, // in liters
    min: 0,
  },
  weight: {
    type: Number,
    min: 0,
  },
  heartRate: {
    type: Number,
    min: 30,
    max: 250,
  },
  bloodPressure: {
    systolic: Number,
    diastolic: Number,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('HealthMetric', healthMetricSchema);
