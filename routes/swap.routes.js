const express = require('express');
const router = express.Router();
const {
  createSwapRequest,
  acceptSwap,
  rejectSwap,
  deleteSwap,
  getSwaps,
  submitFeedback,
} = require('../controllers/swap.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/request', authMiddleware, createSwapRequest);
router.put('/accept/:swapId', authMiddleware, acceptSwap);
router.put('/reject/:swapId', authMiddleware, rejectSwap);
router.delete('/delete/:swapId', authMiddleware, deleteSwap);
router.get('/', authMiddleware, getSwaps);
router.post('/feedback', authMiddleware, submitFeedback);

module.exports = router;