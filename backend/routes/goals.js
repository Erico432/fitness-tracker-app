const express = require('express');
const router = express.Router();
const {
  getGoals,
  createGoal,
  updateGoalProgress,
  updateGoal,
  deleteGoal,
} = require('../controllers/goalController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getGoals).post(protect, createGoal);
router.put('/:id/progress', protect, updateGoalProgress);
router.route('/:id').put(protect, updateGoal).delete(protect, deleteGoal);

module.exports = router;
