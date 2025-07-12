const Swap = require('../models/Swap');
const User = require('../models/User');

exports.createSwapRequest = async (req, res) => {
  const { receiverId, skillOffered, skillWanted } = req.body;
  try {
    const receiver = await User.findById(receiverId);
    if (!receiver || receiver.isBanned || !receiver.isPublic) {
      return res.status(400).json({ message: 'Invalid receiver' });
    }

    const swap = new Swap({
      requester: req.user.userId,
      receiver: receiverId,
      skillOffered,
      skillWanted,
    });
    await swap.save();
    res.status(201).json({ message: 'Swap request created', swap });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.acceptSwap = async (req, res) => {
  const { swapId } = req.params;
  try {
    const swap = await Swap.findById(swapId);
    if (!swap || swap.receiver.toString() !== req.user.userId) {
      return res.status(400).json({ message: 'Invalid swap request' });
    }
    swap.status = 'accepted';
    await swap.save();
    res.json({ message: 'Swap accepted', swap });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.rejectSwap = async (req, res) => {
  const { swapId } = req.params;
  try {
    const swap = await Swap.findById(swapId);
    if (!swap || swap.receiver.toString() !== req.user.userId) {
      return res.status(400).json({ message: 'Invalid swap request' });
    }
    swap.status = 'rejected';
    await swap.save();
    res.json({ message: 'Swap rejected', swap });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteSwap = async (req, res) => {
  const { swapId } = req.params;
  try {
    const swap = await Swap.findById(swapId);
    if (!swap || swap.requester.toString() !== req.user.userId || swap.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot delete swap' });
    }
    swap.status = 'cancelled';
    await swap.save();
    res.json({ message: 'Swap request deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSwaps = async (req, res) => {
  try {
    const swaps = await Swap.find({
      $or: [{ requester: req.user.userId }, { receiver: req.user.userId }],
    })
      .populate('requester', 'name')
      .populate('receiver', 'name')
      .lean();
    res.json(swaps);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitFeedback = async (req, res) => {
  const { swapId, rating, comment } = req.body;
  try {
    const swap = await Swap.findById(swapId);
    if (!swap || swap.status !== 'accepted') {
      return res.status(400).json({ message: 'Invalid or unaccepted swap' });
    }
    if (swap.requester.toString() !== req.user.userId && swap.receiver.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const recipientId =
      swap.requester.toString() === req.user.userId ? swap.receiver : swap.requester;

    const feedback = new Feedback({
      swap: swapId,
      reviewer: req.user.userId,
      recipient: recipientId,
      rating,
      comment,
    });
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted', feedback });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};