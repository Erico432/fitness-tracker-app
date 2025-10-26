const Workout = require('../models/Workout');

// @desc    Get all workouts for user
// @route   GET /api/workouts
// @access  Private
const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id }).sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single workout
// @route   GET /api/workouts/:id
// @access  Private
const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (workout && workout.user.toString() === req.user._id.toString()) {
      res.json(workout);
    } else {
      res.status(404).json({ message: 'Workout not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new workout
// @route   POST /api/workouts
// @access  Private
const createWorkout = async (req, res) => {
  try {
    const { exerciseName, category, duration, caloriesBurned, intensity, notes, date } = req.body;

    const workout = await Workout.create({
      user: req.user._id,
      exerciseName,
      category,
      duration,
      caloriesBurned,
      intensity,
      notes,
      date: date || Date.now(),
    });

    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update workout
// @route   PUT /api/workouts/:id
// @access  Private
const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (workout && workout.user.toString() === req.user._id.toString()) {
      workout.exerciseName = req.body.exerciseName || workout.exerciseName;
      workout.category = req.body.category || workout.category;
      workout.duration = req.body.duration || workout.duration;
      workout.caloriesBurned = req.body.caloriesBurned || workout.caloriesBurned;
      workout.intensity = req.body.intensity || workout.intensity;
      workout.notes = req.body.notes || workout.notes;
      workout.date = req.body.date || workout.date;

      const updatedWorkout = await workout.save();
      res.json(updatedWorkout);
    } else {
      res.status(404).json({ message: 'Workout not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete workout
// @route   DELETE /api/workouts/:id
// @access  Private
const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (workout && workout.user.toString() === req.user._id.toString()) {
      await workout.deleteOne();
      res.json({ message: 'Workout removed' });
    } else {
      res.status(404).json({ message: 'Workout not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get workout statistics
// @route   GET /api/workouts/stats
// @access  Private
const getWorkoutStats = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id });

    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce((acc, workout) => acc + workout.duration, 0);
    const totalCalories = workouts.reduce((acc, workout) => acc + workout.caloriesBurned, 0);

    // Get workouts by category
    const categoryStats = workouts.reduce((acc, workout) => {
      acc[workout.category] = (acc[workout.category] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalWorkouts,
      totalDuration,
      totalCalories,
      categoryStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkoutStats,
};
