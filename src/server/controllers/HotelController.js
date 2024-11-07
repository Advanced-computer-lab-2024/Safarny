const HotelReservation = require("../models/HotelReservation.js");

const createHotelBooking = async (req, res) => {
    const {
        hotelid,
        touristid,
        hotelName,
        checkInDate,
        checkOutDate,
        adults,
        roomType,
        Price,
        hotelDistancefromCenter,
        hotelDescription,
    } = req.body;
    try{
        const newBooking = new HotelReservation({
            hotelid,
            touristid,
            hotelName,
            checkInDate,
            checkOutDate,
            adults,
            roomType,
            Price,
            hotelDistancefromCenter,
            hotelDescription,
        });
        await newBooking.save();
        res.status(201).json(newBooking);
        
    }catch (error) {
        console.error("Error saving booking:", error.message); // Log any errors
        res.status(500).json({ error: error.message });
      }

};


const getAllBookingsByid = async (req, res) => {
    try {
      const touristId = req.params.touristId; // Retrieve touristId from URL parameter
  
      // Find all bookings for the specified touristId
      const bookings = await HotelReservation.find({ touristId });
  
      res.status(200).json(bookings);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

module.exports = { createHotelBooking,getAllBookingsByid };