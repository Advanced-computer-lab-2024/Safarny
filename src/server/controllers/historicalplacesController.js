const HistoricalPlace = require("../models/historicalplaces.js");
const Tag = require("../models/historicalTags.js");

const createHistoricalPlace = async (req, res) => {
  try {
    const {
      description,
      pictures,
      location,
      openingHours,
      ticketPrices,
      tagNames,
    } = req.body;

    if (!description || !location || !openingHours || !ticketPrices || !tagNames) {
      return res.status(400).send({ error: 'All fields are required' });
    }

    let tagsId = [];
    for (let tagName of tagNames) {
      let tag = await Tag.findOne({ name: { $regex: new RegExp(`^${tagName}$`, 'i') } });
      if (!tag) {
        return res.status(400).send({ error: `Tag ${tagName} does not exist` });
      }
      tagsId.push(tag._id);
    }

    const newPlace = new HistoricalPlace({
      description,
      pictures,
      location,
      openingHours,
      ticketPrices,
      tags: tagsId,
    });

    const savedPlace = await newPlace.save();
    res.status(201).send(savedPlace);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getAllHistoricalPlaces = async (req, res) => {
  try {
    const places = await HistoricalPlace.find();
    res.status(200).json(places); // Send the response
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getHistoricalPlaceById = async (req, res) => {
  try {
    const placeId = req.params.id;

    const place = await HistoricalPlace.findById(placeId);

    if (!place) {
      return res.status(404).json({ message: "Historical place not found" });
    }

    res.status(200).json(place);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateHistoricalPlaceById = async (req, res) => {
  try {
    const placeId = req.params.id;
    const { description, pictures, location, openingHours, ticketPrices } =
      req.body;

    const updatedPlace = await HistoricalPlace.findByIdAndUpdate(
      placeId,
      { description, pictures, location, openingHours, ticketPrices },
      { new: true, runValidators: true }
    );

    if (!updatedPlace) {
      return res.status(404).json({ message: "Historical place not found" });
    }

    res.status(200).json({
      message: "Historical place updated successfully",
      place: updatedPlace,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteHistoricalPlaceById = async (req, res) => {
  try {
    const placeId = req.params.id;

    const deletedPlace = await HistoricalPlace.findByIdAndDelete(placeId);

    if (!deletedPlace) {
      return res.status(404).json({ message: "Historical place not found" });
    }

    res.status(200).json({ message: "Historical place deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getHistoricalPlacesFiltered = async (req, res) => {
  const { tags } = req.query;
  const filter = {};

  if (tags) filter.tags = { $in: tags.split(",") };

  try {
    const places = await HistoricalPlace.find(filter);
    res.status(200).json(places);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createHistoricalPlace,
  getAllHistoricalPlaces,
  getHistoricalPlaceById,
  updateHistoricalPlaceById,
  deleteHistoricalPlaceById,
  getHistoricalPlacesFiltered,
};
