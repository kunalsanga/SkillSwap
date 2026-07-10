const express = require('express');
const { createSkill, updateSkill, deleteSkill } = require('../controllers/userSkill.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createUserSkillSchema, updateUserSkillSchema } = require('../validators/userSkill.validator');

const router = express.Router();

// Globally require authentication for user skill routes
router.use(authMiddleware);

// CRUD endpoints for user skills
router.post('/', validate(createUserSkillSchema), createSkill);
router.put('/:id', validate(updateUserSkillSchema), updateSkill);
router.delete('/:id', deleteSkill);

module.exports = router;
