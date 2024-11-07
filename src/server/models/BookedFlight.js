const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  flightid: String,
  touristid: String, // Adjusted naming to match frontend
  aircraft: String,
  DepartureDate: Date,
  ArrivalDate: Date,
  returnDate: Date, // New field for return date
  originLocationCode: String,
  destinationLocationCode: String,
  destinationLocationCode2: String, // New field for second destination code
  adults: Number, // New field for number of adults
  children: Number, // New field for number of children
  infants: Number, // New field for number of infants
  travelClass: String, // New field for travel class (e.g., ECONOMY, BUSINESS)
  nonStop: Boolean, // New field to indicate non-stop flights
  Price: Number,
  Airline: String,
});

const BookedFlight = mongoose.model("BookedFlight", bookingSchema);
module.exports = BookedFlight;
