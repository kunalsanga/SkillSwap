const express = require('express');
const {
  createSwap,
  listSwaps,
  acceptSwap,
  rejectSwap,
  cancelSwap,
  completeSwap,
} = require('../controllers/swap.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { validateBody } = require('../validators/validator');

const router = express.Router();

router.use(authMiddleware);

// POST /api/swap-request
router.post(
  '/',
  validateBody({
    required: ['receiverId', 'offeredSkillId', 'wantedSkillId'],
    ids: ['receiverId', 'offeredSkillId', 'wantedSkillId'],
  }),
  createSwap
);

// GET /api/swap-request
router.get('/', listSwaps);

// PATCH transitions
router.patch('/:id/accept', acceptSwap);
router.patch('/:id/reject', rejectSwap);
router.patch('/:id/cancel', cancelSwap);
router.patch('/:id/complete', completeSwap);

module.exports = router;
