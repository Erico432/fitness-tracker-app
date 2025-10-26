const Streak = require('../models/Streak');
const Workout = require('../models/Workout');

// @desc    Get user streak
// @route   GET /api/streak
// @access  Private
const getStreak = async (req, res) => {
  try {
    let streak = await Streak.findOne({ user: req.user._id });

    if (!streak) {
      streak = await Streak.create({
        user: req.user._id,
        currentStreak: 0,
        longestStreak: 0,
      });
    }

    res.json(streak);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update streak after workout
// @route   POST /api/streak/update
// @access  Private
const updateStreak = async (req, res) => {
  try {
    let streak = await Streak.findOne({ user: req.user._id });

    if (!streak) {
      streak = await Streak.create({
        user: req.user._id,
        currentStreak: 1,
        longestStreak: 1,
        lastWorkoutDate: Date.now(),
        streakStartDate: Date.now(),
      });
      return res.json(streak);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastWorkout = new Date(streak.lastWorkoutDate);
    lastWorkout.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((today - lastWorkout) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
      // Same day, no change
      return res.json(streak);
    } else if (daysDiff === 1) {
      // Consecutive day
      streak.currentStreak += 1;
      
      if (streak.currentStreak > streak.longestStreak) {
        streak.longestStreak = streak.currentStreak;
      }
    } else {
      // Streak broken
      streak.currentStreak = 1;
      streak.streakStartDate = Date.now();
    }

    // Calculate level based on total points
    streak.level = Math.floor(streak.totalPoints / 100) + 1;

    streak.lastWorkoutDate = Date.now();
    await streak.save();

    res.json(streak);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get leaderboard
// @route   GET /api/streak/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Streak.find()
      .populate('user', 'name email')
      .sort({ totalPoints: -1 })
      .limit(50);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStreak,
  updateStreak,
  getLeaderboard,
};
