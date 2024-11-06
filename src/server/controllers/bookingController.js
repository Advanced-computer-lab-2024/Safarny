const mongoose = require("mongoose");
const Booking = require("../models/Booking.js");
const Itinerary = require("../models/Itinerary.js");
const Activity = require("../models/Activity.js");
const User = require("../models/userModel.js");

const createBooking = async (req, res) => {
  const { itinerary, activity, tourist, bookingDate } = req.body;

  if (tourist === undefined || tourist === null) {
    return res.status(400).json({ message: "Tourist is required" });
  }
  if (bookingDate === undefined || bookingDate === null) {
    return res.status(400).json({ message: "Booking date is required" });
  }

  if (
    (itinerary === undefined || itinerary === null) &&
    (activity === undefined || activity === null)
  ) {
    return res
      .status(400)
      .json({ message: "Itinerary or activity is required" });
  }
  var newBooking = null;
  var foundItinerary = null;
  var foundActivity = null;
  var foundTourist = null;

  if (tourist !== undefined && tourist !== null) {
    foundTourist = await User.findById(tourist);
    if (!foundTourist) {
      return res.status(400).json({ message: "Tourist not found" });
    }
  }

  if (itinerary !== undefined && itinerary !== null) {
    foundItinerary = await Itinerary.findById(itinerary);
    if (!foundItinerary) {
      return res.status(400).json({ message: "Itinerary not found" });
    }
    // check if the itinerary is active
    if (foundItinerary.bookingOpen !== "active") {
      return res.status(400).json({ message: "This Itinerary is not active" });
    }
    newBooking = new Booking({
      itinerary: itinerary,
      tourist,
      bookingDate,
    });
  }

  if (activity !== undefined && activity !== null) {
    foundActivity = await Activity.findById(activity);
    if (!foundActivity) {
      return res.status(400).json({ message: "Activity not found" });
    }
    if (foundActivity.bookingOpen !== true) {
      return res.status(400).json({ message: "This Activity is not active" });
    }
    newBooking = new Booking({
      activity: activity,
      tourist,
      bookingDate,
    });
  }

  //check if the bookingDate exists in the availableDates of the itinerary/activity

  if (itinerary !== undefined && itinerary !== null) {
    if (!foundItinerary.availableDates.includes(bookingDate)) {
      return res.status(400).json({
        message: "This date is not available in the itinerary",
      });
    }
  }

  if (activity !== undefined && activity !== null) {
    if (!foundActivity.date === bookingDate) {
      return res.status(400).json({
        message: "This date is not available in the activity",
      });
    }
  }

  //check if the bookingDate is not in the past
  const today = new Date();
  const bookingDateObj = new Date(bookingDate);
  if (bookingDateObj < today) {
    return res.status(400).json({ message: "Booking date is in the past" });
  }

  //check if the bookingDate is not within the 2 days threshold
  const twoDays = new Date();
  twoDays.setDate(today.getDate() + 2);
  if (bookingDateObj < twoDays) {
    return res
      .status(400)
      .json({ message: "Booking date is within the 2 days threshold" });
  }

  //check if the tourist already has a booking on that date
  const existingBooking = await Booking.find({
    tourist: tourist,
    bookingDate: bookingDate,
  });
  if (existingBooking.length > 0) {
    return res
      .status(400)
      .json({ message: "Tourist already has a booking on that date" });
  }

  //check if the tourist has money to book the itinerary/activity
  if (itinerary !== undefined && itinerary !== null) {
    if (foundTourist.wallet < foundItinerary.price) {
      return res
        .status(400)
        .json({ message: "Tourist has insufficient funds" });
    } else {
      foundTourist.wallet -= foundItinerary.price;
    }
  }

  if (activity !== undefined && activity !== null) {
    if (foundTourist.wallet < foundActivity.price) {
      return res
        .status(400)
        .json({ message: "Tourist has insufficient funds" });
    } else {
      foundTourist.wallet -= foundItinerary.price;
    }
  }

  await newBooking.save();

  // if it was an activity, add the activity to the tourist's activities and add the tourist to the activity's tourists

  // if (activity !== undefined && activity !== null) {
  //   foundTourist.acttivities.push(activity);
  //   foundActivity.tourists.push(tourist);
  //   await foundActivity.save();
  // }

  // // if it was an itinerary, add the itinerary to the tourist's itineraries and add the tourist to the itinerary's tourists

  // if (itinerary !== undefined && itinerary !== null) {
  //   foundTourist.itineraries.push(itinerary);
  //   foundItinerary.tourists.push(tourist);
  //   await foundItinerary.save();
  // }

  let pointsEarned = 0;

  if (
    foundTourist.loyaltyLevel === "level 1" ||
    foundTourist.loyaltyLevel === "none"
  ) {
    pointsEarned =
      (itinerary ? foundItinerary.price : foundActivity.price) * 0.5;
  } else if (foundTourist.loyaltyLevel === "level 2") {
    pointsEarned = (itinerary ? foundItinerary.price : foundActivity.price) * 1;
  } else if (foundTourist.loyaltyLevel === "level 3") {
    pointsEarned =
      (itinerary ? foundItinerary.price : foundActivity.price) * 1.5;
  }

  foundTourist.loyaltyPoints += pointsEarned;

  // foundTourist.updateLoyaltyLevel();
  await foundTourist.save();

  res.status(201).json(newBooking);
};

const getBookings = async (req, res) => {
  const { touristId } = req.params;

  if (!touristId) {
    return res.status(400).json({ message: "Tourist is required" });
  }
  const foundTourist = await User.findById(touristId);
  if (!foundTourist) {
    return res.status(400).json({ message: "Tourist not found" });
  }
  const bookings = await Booking.find({ tourist: touristId })
    .populate("itinerary", "name price")
    .populate("activity", "location price");
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

const cancelBooking = async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id);
  if (!booking) {
    return res.status(400).json({ message: "Booking not found" });
  }
  if (booking.status === "cancelled") {
    return res.status(400).json({ message: "Booking already cancelled" });
  }
  if (booking.status === "confirmed") {
    return res.status(400).json({ message: "Booking already confirmed" });
  }
  if (booking.status === "in-active") {
    return res.status(400).json({ message: "Booking already in-active" });
  }
  if (booking.status === "active") {
    booking.status = "cancelled";
    await booking.save();
    return res.status(200).json(booking);
  }
};

module.exports = {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking,
  cancelBooking,
};
