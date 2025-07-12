const User = require('../models/User');
const Swap = require('../models/Swap');
const Feedback = require('../models/Feedback');

exports.rejectSkillDescription = async (req, res) => {
  const { userId, skill } = req.body;
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access required' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.skillsOffered = user.skillsOffered.filter((s) => s !== skill);
    user.skillsWanted = user.skillsWanted.filter((s) => s !== skill);
    await user.save();
    res.json({ message: 'Skill description rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.banUser = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access required' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isBanned = true;
    await user.save();
    res.json({ message: 'User banned' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSwapStats = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access required' });
    const stats = await Swap.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.sendPlatformMessage = async (req, res) => {
  const { message } = req.body;
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access required' });
    // Placeholder for sending message (e.g., store in a notifications collection or integrate with a messaging service)
    res.json({ message: 'Platform-wide message sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getReports = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access required' });
    const users = await User.countDocuments();
    const swaps = await Swap.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);
    const feedbacks = await Feedback.countDocuments();
    res.json({ users, swaps, feedbacks });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};