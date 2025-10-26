const express = require('express');
const router = express.Router();
const {
  getTemplates,
  getTemplateById,
  useTemplate,
  createTemplate,
} = require('../controllers/templateController');
const { protect } = require('../middleware/auth');

router.route('/').get(getTemplates).post(protect, createTemplate);
router.get('/:id', getTemplateById);
router.post('/:id/use', protect, useTemplate);

module.exports = router;
