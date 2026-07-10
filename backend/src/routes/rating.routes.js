const express = require('express');
const { createFeedback, getUserFeedback } = require('../controllers/rating.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { validateBody } = require('../validators/validator');

const router = express.Router();

// POST /api/feedback (Protected, validates fields & rating range)
router.post(
  '/',
  authMiddleware,
  validateBody({
    required: ['swapRequestId', 'rating'],
    ids: ['swapRequestId'],
    rating: 'rating',
  }),
  createFeedback
);

// GET /api/feedback/:userId (Public profile feedback)
router.get('/:userId', getUserFeedback);

module.exports = router;
