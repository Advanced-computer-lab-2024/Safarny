const mongoose = require("mongoose");

// Schema for Historical Places
const historicalPlaceSchema = new mongoose.Schema(
  {
    description: { type: String, required: true }, // Description of the historical place
    pictures: [String], // Array of image URLs (multiple pictures)
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    openingHours: { type: String, required: true },
      rating: {
          type: [Number], // Array of numbers
          default: [5], // Default to an array with a single rating of 5
      },
      averageRating: { type: Number, default: 5 }, // Default average rating to 5
    ticketPrices: { type: Number, required: true }, // Ticket price for entry
    currency: { type: String, required: true }, // Currency of the ticket price
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "HistoricalTags" }], // Reference to tags
    createdby: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the ToursimGovernor who created the historical place
    vistitedby: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Reference to the tourists who visited the historical place
  },
  {
    collection: "historicalplaces", // Name of the collection in MongoDB
  }
);

// Creating the model for historical places
const HistoricalPlace = mongoose.model(
  "HistoricalPlace",
  historicalPlaceSchema
);

module.exports = HistoricalPlace;
