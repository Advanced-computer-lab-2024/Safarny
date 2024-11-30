const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  // Configure your email service here
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate a 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Send OTP via email
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { generateOTP, sendOTPEmail };

