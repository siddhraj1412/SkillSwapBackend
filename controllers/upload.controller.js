const cloudinary = require('../utils/cloudinary');

exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const result = await cloudinary.uploader.upload(req.file.path);
    res.json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};