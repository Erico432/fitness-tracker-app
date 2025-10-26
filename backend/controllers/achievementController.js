const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const Workout = require('../models/Workout');
const Streak = require('../models/Streak');

// Initialize default achievements
const initializeAchievements = async () => {
  const defaultAchievements = [
    {
      name: 'First Step',
      description: 'Complete your first workout',
      icon: '🎯',
      category: 'milestone',
      requirement: { type: 'workout_count', value: 1 },
      points: 10,
      rarity: 'common',
    },
    {
      name: 'Getting Started',
      description: 'Complete 5 workouts',
      icon: '🏃',
      category: 'milestone',
      requirement: { type: 'workout_count', value: 5 },
      points: 25,
      rarity: 'common',
    },
    {
      name: 'Consistent Performer',
      description: 'Complete 10 workouts',
      icon: '💪',
      category: 'milestone',
      requirement: { type: 'workout_count', value: 10 },
      points: 50,
      rarity: 'rare',
    },
    {
      name: 'Fitness Enthusiast',
      description: 'Complete 25 workouts',
      icon: '🔥',
      category: 'milestone',
      requirement: { type: 'workout_count', value: 25 },
      points: 100,
      rarity: 'rare',
    },
    {
      name: 'Fitness Master',
      description: 'Complete 50 workouts',
      icon: '🏆',
      category: 'milestone',
      requirement: { type: 'workout_count', value: 50 },
      points: 200,
      rarity: 'epic',
    },
    {
      name: 'Legend',
      description: 'Complete 100 workouts',
      icon: '👑',
      category: 'milestone',
      requirement: { type: 'workout_count', value: 100 },
      points: 500,
      rarity: 'legendary',
    },
    {
      name: '7-Day Warrior',
      description: 'Maintain a 7-day workout streak',
      icon: '⚡',
      category: 'streak',
      requirement: { type: 'streak_days', value: 7 },
      points: 75,
      rarity: 'rare',
    },
    {
      name: '30-Day Champion',
      description: 'Maintain a 30-day workout streak',
      icon: '🌟',
      category: 'streak',
      requirement: { type: 'streak_days', value: 30 },
      points: 300,
      rarity: 'epic',
    },
    {
      name: 'Cardio King',
      description: 'Complete 20 cardio workouts',
      icon: '❤️',
      category: 'workout',
      requirement: { type: 'category_specific', value: 20, categoryType: 'cardio' },
      points: 100,
      rarity: 'rare',
    },
    {
      name: 'Strength Beast',
      description: 'Complete 20 strength workouts',
      icon: '💪',
      category: 'workout',
      requirement: { type: 'category_specific', value: 20, categoryType: 'strength' },
      points: 100,
      rarity: 'rare',
    },
    {
      name: 'Calorie Crusher',
      description: 'Burn 5000 total calories',
      icon: '🔥',
      category: 'milestone',
      requirement: { type: 'calories_burned', value: 5000 },
      points: 150,
      rarity: 'epic',
    },
    {
      name: 'Early Bird',
      description: 'Complete 10 workouts before 7 AM',
      icon: '🌅',
      category: 'special',
      requirement: { type: 'workout_count', value: 10 },
      points: 100,
      rarity: 'rare',
    },
  ];

  for (const achievement of defaultAchievements) {
    await Achievement.findOneAndUpdate(
      { name: achievement.name },
      achievement,
      { upsert: true, new: true }
    );
  }
};

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find();
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user achievements
// @route   GET /api/achievements/user
// @access  Private
const getUserAchievements = async (req, res) => {
  try {
    const userAchievements = await UserAchievement.find({ user: req.user._id })
      .populate('achievement')
      .sort({ unlockedAt: -1 });
    
    res.json(userAchievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check and unlock achievements
// @route   POST /api/achievements/check
// @access  Private
const checkAchievements = async (req, res) => {
  try {
    const userId = req.user._id;
    const workouts = await Workout.find({ user: userId });
    const streak = await Streak.findOne({ user: userId });
    const achievements = await Achievement.find();
    
    const newlyUnlocked = [];

    for (const achievement of achievements) {
      const userAchievement = await UserAchievement.findOne({
        user: userId,
        achievement: achievement._id,
      });

      // Skip if already unlocked
      if (userAchievement && userAchievement.isUnlocked) continue;

      let progress = 0;
      let shouldUnlock = false;

      switch (achievement.requirement.type) {
        case 'workout_count':
          progress = workouts.length;
          shouldUnlock = progress >= achievement.requirement.value;
          break;

        case 'streak_days':
          progress = streak ? streak.currentStreak : 0;
          shouldUnlock = progress >= achievement.requirement.value;
          break;

        case 'calories_burned':
          progress = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
          shouldUnlock = progress >= achievement.requirement.value;
          break;

        case 'category_specific':
          const categoryWorkouts = workouts.filter(
            w => w.category === achievement.requirement.categoryType
          );
          progress = categoryWorkouts.length;
          shouldUnlock = progress >= achievement.requirement.value;
          break;

        case 'total_duration':
          progress = workouts.reduce((sum, w) => sum + w.duration, 0);
          shouldUnlock = progress >= achievement.requirement.value;
          break;
      }

      if (userAchievement) {
        // Update progress
        userAchievement.progress.current = progress;
        if (shouldUnlock && !userAchievement.isUnlocked) {
          userAchievement.isUnlocked = true;
          userAchievement.unlockedAt = Date.now();
          
          // Update user points
          if (streak) {
            streak.totalPoints += achievement.points;
            await streak.save();
          }
          
          newlyUnlocked.push(achievement);
        }
        await userAchievement.save();
      } else {
        // Create new user achievement
        const newUserAchievement = await UserAchievement.create({
          user: userId,
          achievement: achievement._id,
          progress: {
            current: progress,
            target: achievement.requirement.value,
          },
          isUnlocked: shouldUnlock,
          unlockedAt: shouldUnlock ? Date.now() : null,
        });

        if (shouldUnlock) {
          if (streak) {
            streak.totalPoints += achievement.points;
            await streak.save();
          }
          newlyUnlocked.push(achievement);
        }
      }
    }

    res.json({
      message: 'Achievements checked',
      newlyUnlocked,
      totalPoints: streak ? streak.totalPoints : 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  initializeAchievements,
  getAchievements,
  getUserAchievements,
  checkAchievements,
};
