const HistoricalTags = require("../models/historicalTags"); // Adjust the path as necessary

// Create a new historical tag
const createHistoricalTag = async (req, res) => {
  try {
    const newHistoricalTag = new HistoricalTags(req.body);
    const savedHistoricalTag = await newHistoricalTag.save();
    res.status(201).json(savedHistoricalTag);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllHistoricalTags = async (req, res) => {
  try {
    const tags = await HistoricalTags.find();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createHistoricalTag,
  getAllHistoricalTags
};
