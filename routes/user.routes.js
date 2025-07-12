const express = require('express');
const router = express.Router();
const { updateProfile, searchUsersBySkill, getProfile } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../utils/cloudinary').upload;

router.put('/profile', authMiddleware, upload.single('profilePhoto'), updateProfile);
router.get('/search', searchUsersBySkill);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;