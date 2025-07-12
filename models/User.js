const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String, default: '' },
  profilePhoto: { type: String, default: '' }, // Cloudinary URL
  skillsOffered: [{ type: String }],
  skillsWanted: [{ type: String }],
  availability: { type: String, default: '' }, // e.g., "weekends, evenings"
  isPublic: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);