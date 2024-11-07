const BookedFlight = require("../models/BookedFlight.js");


// controllers/bookingController.js

// Create a new booking
const createBooking = async (req, res) => {
  console.log("Received booking data:", req.body); // Log to see incoming data

  const {
    flightid,
    touristid,
    aircraft,
    DepartureDate,
    ArrivalDate,
    returnDate,
    originLocationCode,
    destinationLocationCode,
    destinationLocationCode2,
    adults,
    children,
    infants,
    travelClass,
    nonStop,
    Price,
    Airline,
  } = req.body;

  try {
    const newBooking = new BookedFlight({
      flightid,
      touristid,
      aircraft,
      DepartureDate,
      ArrivalDate,
      returnDate,
      originLocationCode,
      destinationLocationCode,
      destinationLocationCode2,
      adults,
      children,
      infants,
      travelClass,
      nonStop,
      Price,
      Airline,
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error saving booking:", error.message); // Log any errors
    res.status(500).json({ error: error.message });
  }
};




// controllers/bookingController.js

const getAllBookingsByid = async (req, res) => {
    try {
      const touristId = req.params.touristId; // Retrieve touristId from URL parameter
  
      // Find all bookings for the specified touristId
      const bookings = await BookedFlight.find({ touristId });
  
      res.status(200).json(bookings);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

  
module.exports = { createBooking, getAllBookingsByid };