const User = require("../models/userModel.js");
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken"); // Ensure you have imported jwt
const dotenv = require("dotenv");
dotenv.config();

const createSeller = async (req, res) => {
  const { username, email, password, role, description, sellerName } = req.body;
  try {
    const newSeller = new User({
      email,
      username,
      password,
      description,
      sellerName,
      role: "Seller",
    });
    const token = jwt.sign({ id: newSeller._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.LOGIN_EXPIRES_IN,
    });
    await newSeller.save();
    res.status(201).json({
      token,
      data: { user: newSeller },
      message: `user with role ${role} registered successfully`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSellers = async (req, res) => {
  const sellers = await User.find({ role: "Seller" });
  res.status(200).json(sellers);
};

const updateSeller = async (req, res) => {
  const { username, email, password } = req.body;

  const updatedSeller = await User.findOneAndUpdate(
    { email, role: "Seller" },
    { username, password },
    { new: true }
  );
  res.status(200).json(updatedSeller);
};

const deleteSeller = async (req, res) => {
  const { email } = req.body;

  await User.findOneAndDelete({ email });
  res.status(200).json({ message: "Seller deleted successfully" });
};
const deletePostsByCreator = async (req, res) => {
  try {
    const creatorId = req.params.creatorId; // Retrieve the creator's ID from the request parameters

    // Use deleteMany to delete all posts created by the specified user
    const result = await Post.deleteMany({ createdby: creatorId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    res.status(200).json({ message: "All posts by the user have been deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createSeller, getSellers, updateSeller, deleteSeller, deletePostsByCreator };
