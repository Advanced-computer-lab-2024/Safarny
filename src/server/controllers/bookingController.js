const Booking = require("Booking.js");
const mongoose = require("mongoose");

const createBooking = async (req, res) => {
  const { itinerary, tourist, bookingDate, status } = req.body;
  const newBooking = new Booking({ itinerary, tourist, bookingDate, status });
  await newBooking.save();
  res.status(201).json(newBooking);
};

const getBookings = async (req, res) => {
  const bookings = await Booking.find()
    .populate("itinerary")
    .populate("tourist");
  res.status(200).json(bookings);
};

const updateBooking = async (req, res) => {
  const { id } = req.params; //must have the booking id
  const { itinerary, tourist, bookingDate, status } = req.body;

  const updatedBooking = await Booking.findByIdAndUpdate(
    id,
    { itinerary, tourist, bookingDate, status },
    { new: true }
  )
    .populate("itinerary")
    .populate("tourist");
  res.status(200).json(updatedBooking);
};

const deleteBooking = async (req, res) => {
  const { id } = req.params;

  await Booking.findByIdAndDelete(id);
  res.status(200).json({ message: "Booking deleted successfully" });
};

module.exports = { createBooking, getBookings, updateBooking, deleteBooking };
