const HealthMetric = require('../models/HealthMetric');

// @desc    Get all health metrics for user
// @route   GET /api/health-metrics
// @access  Private
const getHealthMetrics = async (req, res) => {
  try {
    const metrics = await HealthMetric.find({ user: req.user._id }).sort({ date: -1 });
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single health metric
// @route   GET /api/health-metrics/:id
// @access  Private
const getHealthMetricById = async (req, res) => {
  try {
    const metric = await HealthMetric.findById(req.params.id);

    if (metric && metric.user.toString() === req.user._id.toString()) {
      res.json(metric);
    } else {
      res.status(404).json({ message: 'Health metric not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new health metric
// @route   POST /api/health-metrics
// @access  Private
const createHealthMetric = async (req, res) => {
  try {
    const { steps, sleepHours, waterIntake, weight, heartRate, bloodPressure, date } = req.body;

    const metric = await HealthMetric.create({
      user: req.user._id,
      steps,
      sleepHours,
      waterIntake,
      weight,
      heartRate,
      bloodPressure,
      date: date || Date.now(),
    });

    res.status(201).json(metric);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update health metric
// @route   PUT /api/health-metrics/:id
// @access  Private
const updateHealthMetric = async (req, res) => {
  try {
    const metric = await HealthMetric.findById(req.params.id);

    if (metric && metric.user.toString() === req.user._id.toString()) {
      metric.steps = req.body.steps !== undefined ? req.body.steps : metric.steps;
      metric.sleepHours = req.body.sleepHours || metric.sleepHours;
      metric.waterIntake = req.body.waterIntake || metric.waterIntake;
      metric.weight = req.body.weight || metric.weight;
      metric.heartRate = req.body.heartRate || metric.heartRate;
      metric.bloodPressure = req.body.bloodPressure || metric.bloodPressure;
      metric.date = req.body.date || metric.date;

      const updatedMetric = await metric.save();
      res.json(updatedMetric);
    } else {
      res.status(404).json({ message: 'Health metric not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete health metric
// @route   DELETE /api/health-metrics/:id
// @access  Private
const deleteHealthMetric = async (req, res) => {
  try {
    const metric = await HealthMetric.findById(req.params.id);

    if (metric && metric.user.toString() === req.user._id.toString()) {
      await metric.deleteOne();
      res.json({ message: 'Health metric removed' });
    } else {
      res.status(404).json({ message: 'Health metric not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getHealthMetrics,
  getHealthMetricById,
  createHealthMetric,
  updateHealthMetric,
  deleteHealthMetric,
};
