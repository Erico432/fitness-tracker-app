const express = require('express');
const router = express.Router();
const {
  getStreak,
  updateStreak,
  getLeaderboard,
} = require('../controllers/streakController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getStreak);
router.post('/update', protect, updateStreak);
router.get('/leaderboard', protect, getLeaderboard);

module.exports = router;
