const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  itinerary: {
    type: Schema.Types.ObjectId,
    ref: "Itinerary",
  },
  activity: {
    type: Schema.Types.ObjectId,
    ref: "Activity",
  },
  tourist: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  bookingDate: {
    type: String,
  },
  // active    = booking request sent (before the 2 days threshold)
  // confirmed = booking confirmed by tourist (after/during the 2 days threshold)
  // cancelled = booking cancelled by tourist (before the 2 days threshold)
  // active/in-active = the booking gets its activity from its itinerary which is set by tourguide
  status: {
    type: String,
    enum: ["confirmed", "cancelled", "active", "in-active"],
    default: "active",
  },
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
