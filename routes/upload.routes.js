const express = require('express');
const router = express.Router();
const { uploadProfilePhoto } = require('../controllers/upload.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../utils/cloudinary').upload;

router.post('/profile-photo', authMiddleware, upload.single('profilePhoto'), uploadProfilePhoto);

module.exports = router;