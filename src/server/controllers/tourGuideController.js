const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const createTourGuide = async (req, res) => {
  console.log(req.body)
  const { username, email, password,mobile, role, YearOfExp, PrevWork } = req.body;
  const newTourGuide = new User({
    username,
    email,
    password,
    mobile,
    YearOfExp,
    PrevWork,
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
  const { username, email, password, newRating } = req.body;

  try {
    const updatedTourGuide = await User.findOneAndUpdate(
      { email, role: "TourGuide" },
      { username, password },
      { new: true }
    );

    if (!updatedTourGuide) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    if (newRating) {
      // Add the new rating to the ratings array
      updatedTourGuide.rating.push(newRating);

      // Calculate the new average rating
      const totalRatings = updatedTourGuide.rating.length;
      const sumRatings = updatedTourGuide.rating.reduce((sum, rate) => sum + rate, 0);
      updatedTourGuide.averageRating = sumRatings / totalRatings;

      // Save the updated tour guide
      await updatedTourGuide.save();
    }

    res.status(200).json(updatedTourGuide);
  } catch (error) {
    console.error("Error updating tour guide:", error);
    res.status(500).json({ message: "Error updating tour guide." });
  }
};

const deleteTourGuide = async (req, res) => {
  const { email } = req.body;

  await User.findOneAndDelete({ email });
  res.status(200).json({ message: "Tour guide deleted successfully" });
};


//update average rating

const updateAverageRatingById = async (id, newRating) => {
  try {
    // Find the tour guide by ID
    const tourGuide = await TourGuide.findById(id);

    if (!tourGuide) {
      throw new Error("Tour guide not found");
    }

    // Add the new rating to the ratings array
    tourGuide.rating.push(newRating);

    // Calculate the new average rating
    const totalRatings = tourGuide.rating.length;
    const sumRatings = tourGuide.rating.reduce((sum, rate) => sum + rate, 0);
    tourGuide.averageRating = sumRatings / totalRatings;

    // Save the updated tour guide
    await tourGuide.save();

    return tourGuide;
  } catch (error) {
    console.error("Error updating average rating:", error);
    throw error;
  }
};

module.exports = {
  createTourGuide,
  getTourGuides,
  updateTourGuide,
  deleteTourGuide,
    updateAverageRatingById,
};
