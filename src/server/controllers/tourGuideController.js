const tourGuideModel = require("../Models/TourGuide.js");
const { default: mongoose } = require("mongoose");

const createTourGuide = async (req, res) => {
  const { username, email, password } = req.body;
  const newTourGuide = new tourGuideModel({ username, email, password });
  await newTourGuide.save();
  res.status(201).json(newTourGuide);
};

const getTourGuides = async (req, res) => {
  const tourGuides = await tourGuideModel.find();
  res.status(200).json(tourGuides);
};

const updateTourGuide = async (req, res) => {
  const { username, email, password } = req.body;

  const updatedTourGuide = await tourGuideModel.findOneAndUpdate(
    { email },
    { username, password },
    { new: true }
  );
  res.status(200).json(updatedTourGuide);
};

const deleteTourGuide = async (req, res) => {
  const { email } = req.body;

  await tourGuideModel.findOneAndDelete({ email });
  res.status(200).json({ message: "Tour guide deleted successfully" });
};

module.exports = {
  createTourGuide,
  getTourGuides,
  updateTourGuide,
  deleteTourGuide,
};
