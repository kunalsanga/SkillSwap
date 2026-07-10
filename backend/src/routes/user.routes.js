const express = require('express');
const { searchPublicUsers, getUserProfile } = require('../controllers/user.controller');

const router = express.Router();

router.get('/', searchPublicUsers);
router.get('/:id', getUserProfile);

module.exports = router;
