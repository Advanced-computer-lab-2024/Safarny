const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itinerarySchema = new Schema(
  {
    name: {
      type: [String], 
      required: true,
    },
    tag: { //for now, but i'm not sure ....
      type: [String],
      enum: ["historic areas", "beaches", "family-friendly", "shopping", "budget-friendly"], // Restrict to specific categories 
      required: true,
    },
    category: {
      type: [String], 
      required: true,
    },
    activities: {
      type: [String], // Array of strings for activities
      required: true,
    },
    locations: {
      type: [String], // Array of strings for locations to be visited
      required: true,
    },
    timeline: {
      type: [String], // Array of strings for timeline of activities
      required: true,
    },
    duration: {
      type: Number, // Duration of each activity in minutes
      required: true,
    },
    language: {
      type: String, // Language of the tour
      required: true,
    },
    price: {
      type: Number, // Price of the tour
      required: true,
    },
    availableDates: {
      type: [Date], // Array of dates when the tour is available
      required: true,
    },
    availableTimes: {
      type: [String], // Array of times when the tour is available
      required: true,
    },
    accessibility: {
      type: Boolean, // Whether the tour is accessible
      required: true,
    },
    pickupLocation: {
      type: String, // Pickup location (Link maybe?)
      required: true,
    },
    dropoffLocation: {
      type: String, // Dropoff location 
      required: true,
    },
  },
  { timestamps: true }
);

const Itinerary = mongoose.model("Itinerary", itinerarySchema);
module.exports = Itinerary;
