const sellerModel = require("../Models/Seller.js");
const { default: mongoose } = require("mongoose");

const createSeller = async (req, res) => {
  const { username, email, password } = req.body;
  const newSeller = new sellerModel({ username, email, password });
  await newSeller.save();
  res.status(201).json(newSeller);
};

const getSellers = async (req, res) => {
  const sellers = await sellerModel.find();
  res.status(200).json(sellers);
};

const updateSeller = async (req, res) => {
  const { username, email, password } = req.body;

  const updatedSeller = await sellerModel.findOneAndUpdate(
    { email },
    { username, password },
    { new: true }
  );
  res.status(200).json(updatedSeller);
};

const deleteSeller = async (req, res) => {
  const { email } = req.body;

  await sellerModel.findOneAndDelete({ email });
  res.status(200).json({ message: "Seller deleted successfully" });
};

module.exports = { createSeller, getSellers, updateSeller, deleteSeller };
