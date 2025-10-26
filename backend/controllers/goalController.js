const Goal = require('../models/Goal');
const Workout = require('../models/Workout');
const HealthMetric = require('../models/HealthMetric');

// @desc    Get all goals for user
// @route   GET /api/goals
// @access  Private
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new goal
// @route   POST /api/goals
// @access  Private
const createGoal = async (req, res) => {
  try {
    const { title, description, type, targetValue, unit, targetDate, priority } = req.body;

    // Create milestones (25%, 50%, 75%, 100%)
    const milestones = [25, 50, 75, 100].map(percent => ({
      value: (targetValue * percent) / 100,
      achieved: false,
    }));

    const goal = await Goal.create({
      user: req.user._id,
      title,
      description,
      type,
      targetValue,
      unit,
      targetDate,
      priority,
      milestones,
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update goal progress
// @route   PUT /api/goals/:id/progress
// @access  Private
const updateGoalProgress = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal || goal.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Auto-calculate progress based on goal type
    let currentValue = 0;

    switch (goal.type) {
      case 'workout_frequency':
        const workouts = await Workout.find({
          user: req.user._id,
          date: { $gte: goal.startDate, $lte: new Date() },
        });
        currentValue = workouts.length;
        break;

      case 'calories_burned':
        const calorieWorkouts = await Workout.find({
          user: req.user._id,
          date: { $gte: goal.startDate, $lte: new Date() },
        });
        currentValue = calorieWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
        break;

      case 'weight_loss':
      case 'weight_gain':
        const latestMetric = await HealthMetric.findOne({
          user: req.user._id,
          weight: { $exists: true },
        }).sort({ date: -1 });
        
        if (latestMetric && latestMetric.weight) {
          const initialMetric = await HealthMetric.findOne({
            user: req.user._id,
            date: { $lte: goal.startDate },
            weight: { $exists: true },
          }).sort({ date: -1 });
          
          if (initialMetric) {
            currentValue = Math.abs(initialMetric.weight - latestMetric.weight);
          }
        }
        break;

      case 'steps':
        const stepMetrics = await HealthMetric.find({
          user: req.user._id,
          date: { $gte: goal.startDate, $lte: new Date() },
        });
        currentValue = stepMetrics.reduce((sum, m) => sum + (m.steps || 0), 0);
        break;

      default:
        currentValue = req.body.currentValue || goal.currentValue;
    }

    goal.currentValue = currentValue;

    // Check and update milestones
    goal.milestones.forEach(milestone => {
      if (!milestone.achieved && currentValue >= milestone.value) {
        milestone.achieved = true;
        milestone.achievedAt = Date.now();
      }
    });

    // Check if goal is completed
    if (currentValue >= goal.targetValue && goal.status === 'active') {
      goal.status = 'completed';
      goal.completedAt = Date.now();
    }

    // Check if goal deadline passed
    if (new Date() > goal.targetDate && goal.status === 'active') {
      goal.status = currentValue >= goal.targetValue ? 'completed' : 'failed';
    }

    await goal.save();
    res.json(goal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal || goal.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal || goal.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    await goal.deleteOne();
    res.json({ message: 'Goal removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGoals,
  createGoal,
  updateGoalProgress,
  updateGoal,
  deleteGoal,
};
