const Itinerary = require("../models/Itinerary.js");
const Tag = require("../models/Tags.js");
const User = require("../models/userModel.js");

const createItinerary = async (req, res) => {
  try {
    const {
      name,
      activities,
      locations,
      timeline,
      duration,
      language,
      price,
      availableDates,
      availableTimes,
      accessibility,
      pickupLocation,
      dropoffLocation,
      tagNames,
      createdby,
    } = req.body;
    console.log(req.body);

    let tagsId = [];

    for (let tagName of tagNames) {
      let tag = await Tag.findOne({ name: tagName });

      if (!tag) {
        return res.status(400).send({ error: `Tag ${tagName} does not exist` });
      }
      tagsId.push(tag._id);
    }

    if (User.findOne({ _id: createdby }) === null) {
      return res
        .status(400)
        .send({ error: `User with id: ${createdby} does not exist` });
    }

    const itinerary = new Itinerary({
      name,
      activities,
      locations,
      timeline,
      duration,
      language,
      price,
      availableDates,
      availableTimes,
      accessibility,
      pickupLocation,
      dropoffLocation,
      createdby,
      tags: tagsId,
    });

    await itinerary.save();
    res.status(201).send(itinerary);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getAllItineraries = async (_, res) => {
  try {
    const itineraries = await Itinerary.find().populate("tags");
    res.status(200).send({ message: "Success", data: itineraries });
  } catch (error) {
    res.status(500).send(error);
  }
};

const getItineraryById = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).send();
    }
    res.status(200).send(itinerary);
  } catch (error) {
    res.status(500).send(error);
  }
};
const updateItineraryById = async (req, res) => {
  const itinerary = await Itinerary.findById(req.params.id);

  if (itinerary) {
    itinerary.name = req.body.name || itinerary.name;
    itinerary.activities = req.body.activities || itinerary.activities;
    itinerary.locations = req.body.locations || itinerary.locations;
    itinerary.timeline = req.body.timeline || itinerary.timeline;
    itinerary.duration = req.body.duration || itinerary.duration;
    itinerary.language = req.body.language || itinerary.language;
    itinerary.price = req.body.price || itinerary.price;
    itinerary.availableDates =
      req.body.availableDates || itinerary.availableDates;
    itinerary.availableTimes =
      req.body.availableTimes || itinerary.availableTimes;
    itinerary.accessibility = req.body.accessibility || itinerary.accessibility;
    itinerary.pickupLocation =
      req.body.pickupLocation || itinerary.pickupLocation;
    itinerary.dropoffLocation =
      req.body.dropoffLocation || itinerary.dropoffLocation;
    itinerary.createdby = req.body.createdby || itinerary.createdby;

    if (req.body.tagNames) {
      let tagsId = [];
      for (let tagName of req.body.tagNames) {
        let tag = await Tag.findOne({ name: tagName });
        if (!tag) {
          return res
            .status(400)
            .send({ error: `Tag ${tagName} does not exist` });
        }
        tagsId.push(tag._id);
      }
      itinerary.tags = tagsId;
    }

    const updatedItinerary = await itinerary.save();
    res.json(updatedItinerary);
  } else {
    res.status(404).json({ message: "Itinerary not found" });
  }
};

const deleteItineraryById = async (req, res) => {
  try {
    const itinerary = await Itinerary.findByIdAndDelete(req.params.id);
    console.log(itinerary);
    console.log(req.params.id);
    console.log(req.params.itineraryId);

    if (!itinerary) {
      return res.status(404).send();
    }

    res.status(200).send(itinerary);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateItineraryTagById = async (req, res) => {
  const { tags } = req.body;

  if (!Array.isArray(tags)) {
    return res.status(400).send({ error: "Tags must be an array of strings" });
  }

  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).send();
    }
    itinerary.tags = tags;
    await itinerary.save();
    res.status(200).send(itinerary);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getItinerariesSorted = async (req, res) => {
  const { sortBy } = req.query;
  const sortCriteria = {};

  if (sortBy) {
    const [field, order] = sortBy.split(":");
    if (field === "date") {
      sortCriteria["availableDates"] = order === "desc" ? -1 : 1;
    } else {
      sortCriteria[field] = order === "desc" ? -1 : 1;
    }
  }

  try {
    const itineraries = await Itinerary.find()
      .populate("tags", "name")
      .populate("activities")
      .sort(sortCriteria);
    res.status(200).send(itineraries);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getItinerariesFiltered = async (req, res) => {
  const { minPrice, maxPrice, startDate, endDate, tags, language } = req.query;
  const filter = {};

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }

  if (startDate || endDate) {
    filter.availableDates = {};
    if (startDate) filter.availableDates.$gte = new Date(startDate);
    if (endDate) filter.availableDates.$lte = new Date(endDate);
  }

  if (tags) filter.tags = { $in: tags.split(",") };
  if (language) filter.language = language;

  try {
    const itineraries = await Itinerary.find(filter).populate("tags", "name");
    res.status(200).send(itineraries);
  } catch (error) {
    res.status(500).send(error);
  }
};

const geItinerariesFor = async (req, res) => {
  const itineraries = await Itinerary.find({
    createdby: req.params.tourguideId,
  })
    .populate("tags", "name")
    .populate("activities", "location");

  res.status(200).json(itineraries);
};

module.exports = {
  createItinerary,
  getAllItineraries,
  getItineraryById,
  updateItineraryById,
  deleteItineraryById,
  updateItineraryTagById,
  getItinerariesSorted,
  getItinerariesFiltered,
  geItinerariesFor,
};
