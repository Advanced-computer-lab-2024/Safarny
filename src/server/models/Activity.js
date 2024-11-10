const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activitySchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  category: [
    {
      type: Schema.Types.ObjectId,
      ref: "ActivityCategory",
    },
  ],
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  specialDiscount: { type: String },
  bookingOpen: { type: Boolean, default: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  archived: {
    type: Boolean,
    default: false, // Set initial value to false
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tags",
    },
  ],
  //advertiser
  createdby: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  //tourist
  boughtby: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  rating: {
    type: [Number], // Array of numbers
    default: [5], // Default to an array with a single rating of 5
  },
});

const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;
