const express = require('express');
const router = express.Router();
const {
  rejectSkillDescription,
  banUser,
  getSwapStats,
  sendPlatformMessage,
  getReports,
} = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/reject-skill', authMiddleware, rejectSkillDescription);
router.put('/ban/:userId', authMiddleware, banUser);
router.get('/swap-stats', authMiddleware, getSwapStats);
router.post('/message', authMiddleware, sendPlatformMessage);
router.get('/reports', authMiddleware, getReports);

module.exports = router;