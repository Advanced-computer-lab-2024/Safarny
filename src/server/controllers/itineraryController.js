const express = require("express");
const Itinerary = require("../models/Itinerary"); 

// Create a new itinerary
const createItinerary = async (req, res) => {
  try {
    const itinerary = new Itinerary(req.body);
    await itinerary.save();
    res.status(201).send(itinerary);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all itineraries
const getAllItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find();
    res.status(200).send(itineraries);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a specific itinerary by ID
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

// Update an itinerary by ID
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

// Delete an itinerary by ID
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

// Update the tags of an itinerary by ID
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

    itinerary.tag = tags;
    await itinerary.save();
    res.status(200).send(itinerary);
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  createItinerary,
  getAllItineraries,
  getItineraryById,
  updateItineraryById,
  deleteItineraryById,
  updateItineraryTagById,
};
