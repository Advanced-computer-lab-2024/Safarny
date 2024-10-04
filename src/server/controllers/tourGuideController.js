const User = require("../models/userModel.js");
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const createTourGuide = async (req, res) => {
  const { username, email, password, role, YearOfExp, PreWork } = req.body;
  const newTourGuide = new User({
    username,
    email,
    password,
    YearOfExp,
    PreWork,
    role: "TourGuide",
  });
  const token = jwt.sign({ id: newTourGuide._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.LOGIN_EXPIRES_IN,
  });
  await newTourGuide.save();
  res.status(201).json({
    token,
    data: { user: newTourGuide },
    message: `user with role ${role} registered successfully`,
  });
};

const getTourGuides = async (req, res) => {
  const tourGuides = await User.find({ role: "TourGuide" });
  res.status(200).json(tourGuides);
};

const updateTourGuide = async (req, res) => {
  const { username, email, password } = req.body;

  const updatedTourGuide = await User.findOneAndUpdate(
    { email, role: "TourGuide" },
    { username, password },
    { new: true }
  );
  res.status(200).json(updatedTourGuide);
};

const deleteTourGuide = async (req, res) => {
  const { email } = req.body;

  await User.findOneAndDelete({ email });
  res.status(200).json({ message: "Tour guide deleted successfully" });
};

module.exports = {
  createTourGuide,
  getTourGuides,
  updateTourGuide,
  deleteTourGuide,
};
