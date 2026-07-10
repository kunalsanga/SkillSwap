const express = require('express');
const {
  getIncoming,
  getOutgoing,
  sendRequest,
  accept,
  reject,
  cancel,
  complete,
} = require('../controllers/swapController');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createSwapSchema } = require('../validators/swapValidator');

const router = express.Router();

// Require authentication for all swaps routes
router.use(authMiddleware);

// Swap requests list endpoints
router.get('/incoming', getIncoming);
router.get('/outgoing', getOutgoing);

// Create request endpoint
router.post('/request', validate(createSwapSchema), sendRequest);

// Swap request state actions
router.patch('/:id/accept', accept);
router.patch('/:id/reject', reject);
router.patch('/:id/cancel', cancel);
router.patch('/:id/complete', complete);

module.exports = router;
