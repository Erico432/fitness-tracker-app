const express = require('express');
const router = express.Router();
const {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkoutStats,
} = require('../controllers/workoutController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getWorkouts).post(protect, createWorkout);
router.get('/stats', protect, getWorkoutStats);
router
  .route('/:id')
  .get(protect, getWorkoutById)
  .put(protect, updateWorkout)
  .delete(protect, deleteWorkout);

module.exports = router;
