const advertiserModel = require("../Models/Advertiser.js");
const { default: mongoose } = require("mongoose");

const createAdvertiser = async (req, res) => {
  const { username, email, password } = req.body;
  const newAdvertiser = new advertiserModel({ username, email, password });
  await newAdvertiser.save();
  res.status(201).json(newAdvertiser);
};

const getAdvertisers = async (req, res) => {
  const advertisers = await advertiserModel.find();
  res.status(200).json(advertisers);
};

const updateAdvertiser = async (req, res) => {
  const { username, email, password } = req.body;

  const updatedAdvertiser = await advertiserModel.findOneAndUpdate(
    { email },
    { username, password },
    { new: true }
  );
  res.status(200).json(updatedAdvertiser);
};

const deleteAdvertiser = async (req, res) => {
  const { email } = req.body;

  await advertiserModel.findOneAndDelete({ email });
  res.status(200).json({ message: "Advertiser deleted successfully" });
};

module.exports = { createAdvertiser, getAdvertisers, updateAdvertiser, deleteAdvertiser };
