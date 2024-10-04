const User = require("../models/userModel.js");
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken"); // Ensure you have imported jwt
const dotenv = require("dotenv");
dotenv.config();

const createAdvertiser = async (req, res) => {
  const {
    username,
    email,
    password,
    role,
    CompanyName,
    CompanyLink,
    CompanyHotline,
  } = req.body;
  const newAdvertiser = new User({
    username,
    email,
    password,
    CompanyName,
    CompanyLink,
    CompanyHotline,
    role: "Advertiser",
  });
  const token = jwt.sign({ id: newAdvertiser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.LOGIN_EXPIRES_IN,
  });
  await newAdvertiser.save();
  res.status(201).json({
    token,
    data: { user: newAdvertiser },
    message: `user with role ${role} registered successfully`,
  });
};

const getAdvertisers = async (req, res) => {
  const advertisers = await User.find({ role: "Advertiser" });
  res.status(200).json(advertisers);
};

const updateAdvertiser = async (req, res) => {
  const { username, email, password } = req.body;

  const updatedAdvertiser = await User.findOneAndUpdate(
    { email, role: "Advertiser" },
    { username, password },
    { new: true }
  );
  res.status(200).json(updatedAdvertiser);
};

const deleteAdvertiser = async (req, res) => {
  const { email } = req.body;

  await User.findOneAndDelete({ email });
  res.status(200).json({ message: "Advertiser deleted successfully" });
};

module.exports = {
  createAdvertiser,
  getAdvertisers,
  updateAdvertiser,
  deleteAdvertiser,
};
