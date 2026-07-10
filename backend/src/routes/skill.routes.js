const express = require('express');
const {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} = require('../controllers/skill.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { adminMiddleware } = require('../middlewares/admin.middleware');

const router = express.Router();

// GET /api/skills (Public / Auth not strictly required for dropdowns, but we can protect it)
// Let's require auth to view skills, just to be safe.
router.get('/', authMiddleware, getSkills);

// Admin only routes for managing global skills
router.use(authMiddleware);
router.use(adminMiddleware);

router.post('/', createSkill);
router.put('/:id', updateSkill);
router.delete('/:id', deleteSkill);

module.exports = router;
