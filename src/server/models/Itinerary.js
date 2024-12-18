const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Activity = require("./Activity.js");

const itinerarySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    //tourist
    boughtby: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    //tourguide
    createdby: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tags",
      },
    ],
    category: {
      type: [String],
      required: true,
    },
    activities: [
      {
        type: Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
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
    currency: {
      type: String, // Currency of the price
      required: true,
    },
    archived: {
      type: Boolean,
      default: false, // Set initial value to false
    },
    availableDates: {
      type: [String], // Array of dates when the tour is available
      required: true,
    },
    availableTimes: {
      type: [String], // Array of times when the tour is available
      required: true,
    },
    accessibility: {
      type: Boolean, // Whether the tour is accessible
      required: true,
        default: true, // Set initial value to true

    },
    pickupLocation: {
      type: String, // Pickup location (Link maybe?)
      required: true,
    },
    dropoffLocation: {
      type: String, // Dropoff location
      required: true,
    },
      rating: {
          type: [Number], // Array of numbers
          default: [], // Default to an array with a single rating of 5
      },
        averageRating: { type: Number, default: 5 }, // Default average rating to 5
    bookingOpen: {
      type: String,
      enum: ["active", "in-active"], // Whether the booking is open
      default: "active",
    },
  },
  { timestamps: true }
);
itinerarySchema.methods.getActivities = async function () {
  return await Activity.find({ _id: { $in: this.activities } });
};

const Itinerary = mongoose.model("Itinerary", itinerarySchema);
module.exports = Itinerary;
