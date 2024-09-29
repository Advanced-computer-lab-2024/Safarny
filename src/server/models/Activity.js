const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // Duration in minutes
    required: true,
  },
  timeline: {
    type: String,
    required: true,
  },
  activityCategory: [
    {
      type: Schema.Types.ObjectId,
      ref: "ActivityCategory",
    },
  ],
  price: {
    type: Number,
    required: true,
  },
});

const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;
