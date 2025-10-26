const express = require('express');
const router = express.Router();
const {
  getAchievements,
  getUserAchievements,
  checkAchievements,
} = require('../controllers/achievementController');
const { protect } = require('../middleware/auth');

router.get('/', getAchievements);
router.get('/user', protect, getUserAchievements);
router.post('/check', protect, checkAchievements);

module.exports = router;
