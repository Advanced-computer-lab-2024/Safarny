const Itinerary = require("../models/Itinerary.js");
const Tag = require("../models/Tags.js");

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
    } = req.body;

    let tagsId = [];

    for (let tagName of tagNames) {
      let tag = await Tag.findOne({ name: tagName });

      if (!tag) {
        return res.status(400).send({ error: `Tag ${tagName} does not exist` });
      }
      tagsId.push(tag._id);
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
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "activities",
    "locations",
    "timeline",
    "duration",
    "language",
    "price",
    "availableDates",
    "availableTimes",
    "accessibility",
    "pickupLocation",
    "dropoffLocation",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).send();
    }

    updates.forEach((update) => (itinerary[update] = req.body[update]));
    await itinerary.save();
    res.status(200).send(itinerary);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteItineraryById = async (req, res) => {
  try {
    const itinerary = await Itinerary.findByIdAndDelete(req.params.id);

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
    sortCriteria[field] = order === "desc" ? -1 : 1;
  }

  try {
    const itineraries = await Itinerary.find().sort(sortCriteria);
    res.status(200).send(itineraries);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getItinerariesFiltered = async (req, res) => {
  const { price, date, tags, language } = req.query;
  const filter = {};

  if (price) filter.price = price;
  if (date) filter.availableDates = date;
  if (tags) filter.tags = { $in: tags.split(",") };
  if (language) filter.language = language;

  try {
    const itineraries = await Itinerary.find(filter);
    res.status(200).send(itineraries);
  } catch (error) {
    res.status(500).send(error);
  }
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
};
