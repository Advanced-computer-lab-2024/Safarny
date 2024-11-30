const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const { generateOTP, sendOTPEmail } = require('../controllers/passwordOTPController');
const bcrypt = require('bcrypt');

// Store OTPs temporarily (in production, use a more secure method like Redis)
const otpStore = new Map();

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = generateOTP();
    otpStore.set(email, otp);

    // Set OTP expiration (5 minutes)
    setTimeout(() => otpStore.delete(email), 5 * 60 * 1000);

    await sendOTPEmail(email, otp);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
});

// Verify OTP
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const storedOTP = otpStore.get(email);

  if (!storedOTP || storedOTP !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  otpStore.delete(email);
  res.status(200).json({ message: 'OTP verified successfully' });
});

// Reset password
router.post('/reset-password', async (req, res) => {
    try {
      const { email, newPassword } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Directly save the new password without hashing
      user.password = newPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ message: 'Error resetting password' });
    }
  });

module.exports = router;

