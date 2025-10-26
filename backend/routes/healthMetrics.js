const express = require('express');
const router = express.Router();
const {
  getHealthMetrics,
  getHealthMetricById,
  createHealthMetric,
  updateHealthMetric,
  deleteHealthMetric,
} = require('../controllers/healthMetricController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getHealthMetrics).post(protect, createHealthMetric);
router
  .route('/:id')
  .get(protect, getHealthMetricById)
  .put(protect, updateHealthMetric)
  .delete(protect, deleteHealthMetric);

module.exports = router;
