const HistoricalPlace = require("../models/historicalplaces.js");
const Tag = require("../models/historicalTags.js");
//const Tag = require("../models/Tags.js");
const AsyncHandler = require("express-async-handler");

const createHistoricalPlace = async (req, res) => {
  try {
    const {
      description,
      pictures,
      coordinates,
      openingHours,
      ticketPrices,
      currency,
      tagNames,
    } = req.body;

    if (!description || !coordinates || !openingHours || !ticketPrices || !currency || !tagNames) {
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
      coordinates,
      openingHours,
      ticketPrices,
      currency,
      tags: tagsId,
    });

    const savedPlace = await newPlace.save();
    res.status(201).send(savedPlace);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createHistoricalPlaceByGovernorId = async (req, res) => {
  try {
    const {
      description,
      pictures,
      coordinates,
      openingHours,
      ticketPrices,
      currency,
      tagNames,
      createdby, // Add createdById to the request body
    } = req.body;


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
      coordinates,
      openingHours,
      ticketPrices,
      currency,
      tags: tagsId,
      createdby, // Set the createdById field
    });

    const savedPlace = await newPlace.save();
    res.status(201).send(savedPlace);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getHistoricalPlaceByGovernorId = async (req, res) => {
  try {
    const { governorId } = req.params;

    const places = await HistoricalPlace.find({ createdby: governorId, createdby: { $exists: true } }).populate('tags', 'name');

    if (!places.length) {
      return res.status(404).json({ message: "No historical places found for this governor" });
    }

    res.status(200).json(places);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getAllHistoricalPlaces = async (req, res) => {
  try {
    const places = await HistoricalPlace.find().populate('tags','name'); // Ensure tags are populated
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
    const { description, pictures, coordinates, openingHours, ticketPrices, currency, rating } =
      req.body;

    const updatedPlace = await HistoricalPlace.findByIdAndUpdate(
      placeId,
      { description, pictures, coordinates, openingHours, ticketPrices, currency, rating },
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
const getHistoricalPlacesSorted = AsyncHandler(async (req, res) => {
  const { sortBy } = req.query;
  const sortCriteria = {};

  // Parse the sortBy query parameter (e.g., "date:asc" or "date:desc")
  if (sortBy) {
    const [field, order] = sortBy.split(":");
    sortCriteria[field] = order === "desc" ? -1 : 1;
  }

  try {
    // Fetch historical places with sorting and populate tags
    const historicalPlaces = await HistoricalPlace.find()
      .populate("tags", "name")  // Populates the 'tags' field with tag names
      .sort(sortCriteria);  // Sort by the provided criteria

    // Send the response back with the sorted historical places
    res.json(historicalPlaces);
  } catch (err) {
    // Handle any errors that occur during the process
    res.status(500).json({ error: err.message });
  }
});


module.exports = {
  createHistoricalPlace,
  getAllHistoricalPlaces,
  getHistoricalPlaceById,
  updateHistoricalPlaceById,
  deleteHistoricalPlaceById,
  getHistoricalPlacesFiltered,
  getHistoricalPlacesSorted,
  createHistoricalPlaceByGovernorId,
  getHistoricalPlaceByGovernorId,
};
