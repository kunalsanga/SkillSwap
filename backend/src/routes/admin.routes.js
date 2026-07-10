const express = require('express');
const {
  getUsers,
  banUser,
  getSwaps,
  postAnnouncement,
  deleteSkill,
} = require('../controllers/admin.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { adminMiddleware } = require('../middlewares/admin.middleware');
const { validateBody } = require('../validators/validator');

const router = express.Router();

// Apply auth and admin middleware to all endpoints
router.use(authMiddleware);
router.use(adminMiddleware);

// GET /api/admin/users
router.get('/users', getUsers);

// PATCH /api/admin/ban/:id
router.patch('/ban/:id', banUser);

// GET /api/admin/swaps
router.get('/swaps', getSwaps);

// POST /api/admin/announcement
router.post(
  '/announcement',
  validateBody({
    required: ['title', 'message'],
  }),
  postAnnouncement
);

// DELETE /api/admin/skill/:id
router.delete('/skill/:id', deleteSkill);

module.exports = router;
