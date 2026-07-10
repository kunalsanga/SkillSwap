const express = require('express');
const {
	login,
	logout,
	me,
	register,
	updateProfile,
} = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const {
	loginSchema,
	profileUpdateSchema,
	registerSchema,
} = require('../validators/auth.validator');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authMiddleware, me);
router.put('/profile', authMiddleware, validate(profileUpdateSchema), updateProfile);
router.post('/logout', authMiddleware, logout);

module.exports = router;
