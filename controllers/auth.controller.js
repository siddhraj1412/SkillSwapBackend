const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const OTP = require('../models/OTP');

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });
    await user.save();

    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    res.status(201).json({ token, user: { id: user._id, name, email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.isBanned) return res.status(400).json({ message: 'Invalid credentials or banned' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    res.json({ token, user: { id: user._id, name: user.name, email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Store OTP in database
    await OTP.create({ userId: user._id, otp, expiresAt });

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Send OTP email
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Skill Swap Platform - Password Reset OTP',
      text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
    });

    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otpRecord = await OTP.findOne({ userId: user._id, otp });
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // OTP is valid, generate a reset token
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '15m', // Short-lived token for password reset
    });

    // Delete OTP after verification
    await OTP.deleteOne({ _id: otpRecord._id });

    res.json({ message: 'OTP verified', resetToken });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired reset token' });
  }
};