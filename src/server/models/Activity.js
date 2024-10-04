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
  specialDiscount: { type: String },
  bookingOpen: { type: Boolean, default: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
  tags: [
    {
    type: Schema.Types.ObjectId,
    ref: "Tags",
  },
  ],
});

const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;
