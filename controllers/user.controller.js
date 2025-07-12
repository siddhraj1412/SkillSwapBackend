const User = require('../models/User');
const cloudinary = require('../utils/cloudinary');

exports.updateProfile = async (req, res) => {
  const { name, location, skillsOffered, skillsWanted, availability, isPublic } = req.body;
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.location = location || user.location;
    user.skillsOffered = skillsOffered || user.skillsOffered;
    user.skillsWanted = skillsWanted || user.skillsWanted;
    user.availability = availability || user.availability;
    user.isPublic = isPublic !== undefined ? isPublic : user.isPublic;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      user.profilePhoto = result.secure_url;
    }

    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.searchUsersBySkill = async (req, res) => {
  const { skill } = req.query;
  try {
    const users = await User.find({
      $or: [
        { skillsOffered: { $regex: skill, $options: 'i' } },
        { skillsWanted: { $regex: skill, $options: 'i' } },
      ],
      isPublic: true,
      isBanned: false,
    })
      .select('name profilePhoto skillsOffered skillsWanted availability')
      .lean();

    // Calculate average rating for each user
    const usersWithRatings = await Promise.all(
      users.map(async (user) => {
        const feedbacks = await Feedback.find({ recipient: user._id }).select('rating');
        const avgRating =
          feedbacks.length > 0
            ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
            : 0;
        return { ...user, avgRating: avgRating.toFixed(1) };
      })
    );

    res.json(usersWithRatings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};