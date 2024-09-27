const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    itinerary: {
      type: Schema.Types.ObjectId,
      ref: "Itinerary",
      required: true,
    },
    tourist: {
      type: Schema.Types.ObjectId,
      ref: "Tourist", // Assuming we have a Tourist model
      required: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
