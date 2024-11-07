const mongoose = require("mongoose");
const Booking = require("../models/Booking.js");
const Itinerary = require("../models/Itinerary.js");
const Activity = require("../models/Activity.js");
const User = require("../models/userModel.js");
const HistoricalPlace = require("../models/historicalplaces.js");

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
    if (foundActivity.date !== bookingDate) {
      return res.status(400).json({
        message: "This date is not available in the activity",
      });
    }
  }

  const today = new Date();
  const bookingDateObj = new Date(bookingDate);

  // //check if the bookingDate is not in the past
  // if (bookingDateObj < today) {
  //   return res.status(400).json({ message: "Booking date is in the past" });
  // }

  //check if the bookingDate is not within the 2 days threshold
  const twoDays = new Date();
  twoDays.setDate(today.getDate() + 2);
  if (bookingDateObj < twoDays) {
    return res.status(400).json({
      message:
        "You can not Book for that date because its within the 2 days threshold",
    });
  }

  //check if the tourist already has a booking on that date that is not cancelled
  const existingBooking = await Booking.find({
    tourist: tourist,
    bookingDate: bookingDate,
    status: { $ne: "cancelled" },
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
      foundTourist.wallet -= foundActivity.price;
    }
  }

  // if it was an activity, add the activity to the tourist's activities and add the tourist to the activity's tourists

  if (activity !== undefined && activity !== null) {
    foundTourist.acttivities.push(activity);
    foundActivity.boughtby.push(tourist);
    await foundActivity.save();
  }

  // if it was an itinerary, add the itinerary to the tourist's itineraries and add the tourist to the itinerary's tourists

  if (itinerary !== undefined && itinerary !== null) {
    foundTourist.itineraries.push(itinerary);
    foundItinerary.boughtby.push(tourist);
    await foundItinerary.save();
  }

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

  await foundTourist.save();
  await newBooking.save();

  res.status(201).json(newBooking);
};

// make function to book a historical place
const bookHistoricalPlace = async (req, res) => {
  const { historicalPlace, tourist, bookingDate, bookingHour } = req.body;
  if (!tourist) {
    return res.status(400).json({ message: "Tourist is required" });
  }
  if (!bookingHour) {
    return res.status(400).json({ message: "Booking hour is required" });
  }
  if (!historicalPlace) {
    return res.status(400).json({ message: "Historical place is required" });
  }

  const foundTourist = await User.findById(tourist);
  if (!foundTourist) {
    return res.status(400).json({ message: "Tourist not found" });
  }

  const foundHistoricalPlace = await HistoricalPlace.findById(historicalPlace);
  if (!foundHistoricalPlace) {
    return res.status(400).json({ message: "Historical place not found" });
  }

  // Parse opening and closing hours from historical place
  const [openingHour, closingHour] = foundHistoricalPlace.openingHours
    .split("-")
    .map((time) => {
      const [hours, minutes] = time.split(":");
      return new Date(1970, 0, 1, hours, minutes);
    });

  // Parse booking hour
  const [bookingHourHours, bookingHourMinutes] = bookingHour.split(":");
  const bookingHourObj = new Date(
    1970,
    0,
    1,
    bookingHourHours,
    bookingHourMinutes
  );

  // Check if booking hour is within opening hours
  if (bookingHourObj < openingHour || bookingHourObj > closingHour) {
    return res.status(400).json({
      message: "Booking hour must be within the opening hours",
    });
  }

  const existingBooking = await Booking.find({
    tourist: tourist,
    bookingHour: bookingHour,
    status: { $ne: "cancelled" },
  });
  if (existingBooking.length > 0) {
    return res
      .status(400)
      .json({ message: "Tourist already has a booking at that hour" });
  }

  if (foundTourist.wallet < foundHistoricalPlace.ticketPrices) {
    return res.status(400).json({ message: "Tourist has insufficient funds" });
  } else {
    foundTourist.wallet -= foundHistoricalPlace.ticketPrices;
  }

  foundTourist.historicalPlaces.push(historicalPlace);
  foundHistoricalPlace.vistitedby.push(tourist);
  await foundHistoricalPlace.save();

  let pointsEarned = 0;
  if (
    foundTourist.loyaltyLevel === "level 1" ||
    foundTourist.loyaltyLevel === "none"
  ) {
    pointsEarned = foundHistoricalPlace.ticketPrices * 0.5;
  } else if (foundTourist.loyaltyLevel === "level 2") {
    pointsEarned = foundHistoricalPlace.ticketPrices * 1;
  } else if (foundTourist.loyaltyLevel === "level 3") {
    pointsEarned = foundHistoricalPlace.ticketPrices * 1.5;
  }

  foundTourist.loyaltyPoints += pointsEarned;

  const newBooking = new Booking({
    historicalPlace: historicalPlace,
    tourist,
    bookingDate,
    bookingHour,
  });

  await foundTourist.save();
  await newBooking.save();

  res.status(201).json(newBooking);
};

//get all bookings for a tourist
const getBookings = async (req, res) => {
  const { touristId } = req.params;

  if (!touristId) {
    return res.status(400).json({ message: "Tourist is required" });
  }
  const foundTourist = await User.findById(touristId);
  if (!foundTourist) {
    return res.status(400).json({ message: "Tourist not found" });
  }

  const today = new Date();
  const twoDaysFromNow = new Date(today);
  twoDaysFromNow.setDate(today.getDate() + 2);

  // Update bookings to "confirmed" if within the 2-day threshold and still "active"
  await Booking.updateMany(
    {
      tourist: touristId,
      status: "active",
      bookingDate: { $lte: twoDaysFromNow.toISOString().split("T")[0] },
    },
    { status: "confirmed" }
  );

  const bookings = await Booking.find({ tourist: touristId })
    .populate("itinerary", "name price")
    .populate("activity", "location price")
    .populate("historicalPlace", "name ticketPrices");
  res.status(200).json(bookings);
};

const updateBooking = async (req, res) => {
  const { id } = req.params;
  const { itinerary, tourist, bookingDate, bookingHour, status } = req.body;

  const updatedBooking = await Booking.findByIdAndUpdate(
    id,
    { itinerary, tourist, bookingDate, bookingHour, status },
    { new: true }
  )
    .populate("itinerary")
    .populate("tourist")
    .populate("activity")
    .populate("historicalPlace");
  res.status(200).json(updatedBooking);
};

const deleteBooking = async (req, res) => {
  const { id } = req.params;

  await Booking.findByIdAndDelete(id);
  res.status(200).json({ message: "Booking deleted successfully" });
};

//cancel a booking for historical place
const cancelBookingHistoricalPlace = async (req, res) => {
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
    const today = new Date();
    const bookingDateObj = new Date(booking.bookingDate);
    const twoDays = new Date();
    twoDays.setDate(today.getDate() + 2);
    if (bookingDateObj <= twoDays) {
      return res.status(400).json({
        message:
          "You can not cancel the Booking because its within the 48 hours threshold",
      });
    }

    const foundTourist = await User.findById(booking.tourist);
    if (!foundTourist) {
      return res.status(400).json({ message: "Tourist not found" });
    }

    const foundHistoricalPlace = await HistoricalPlace.findById(
      booking.historicalPlace
    );
    if (!foundHistoricalPlace) {
      return res.status(400).json({ message: "Historical place not found" });
    }

    foundTourist.wallet += foundHistoricalPlace.ticketPrices;

    let pointsDeducted = 0;
    if (
      foundTourist.loyaltyLevel === "level 1" ||
      foundTourist.loyaltyLevel === "none"
    ) {
      pointsDeducted = foundHistoricalPlace.ticketPrices * 0.5;
    } else if (foundTourist.loyaltyLevel === "level 2") {
      pointsDeducted = foundHistoricalPlace.ticketPrices * 1;
    } else if (foundTourist.loyaltyLevel === "level 3") {
      pointsDeducted = foundHistoricalPlace.ticketPrices * 1.5;
    }
    foundTourist.loyaltyPoints -= pointsDeducted;

    foundTourist.historicalPlaces = foundTourist.historicalPlaces.filter(
      (historicalPlace) =>
        historicalPlace._id.toString() !== booking.historicalPlace.toString()
    );
    foundHistoricalPlace.vistitedby = foundHistoricalPlace.vistitedby.filter(
      (tourist) => tourist.toString() !== booking.tourist.toString()
    );
    await foundHistoricalPlace.save();
    await foundTourist.save();

    booking.status = "cancelled";

    await booking.save();
    return res.status(200).json(booking);
  }
};

//cancel a booking
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
    //check if the booking date is not within the 2 days threshold
    const today = new Date();
    const bookingDateObj = new Date(booking.bookingDate);
    const twoDays = new Date();
    twoDays.setDate(today.getDate() + 2);
    if (bookingDateObj <= twoDays) {
      return res.status(400).json({
        message:
          "You can not cancel the Booking because its within the 48 hours threshold",
      });
    }

    if (!booking.activity && booking.itinerary) {
      const foundItinerary = await Itinerary.findById(booking.itinerary);
      if (!foundItinerary) {
        return res.status(400).json({ message: "Itinerary not found" });
      }
      const foundTourist = await User.findById(booking.tourist);
      if (!foundTourist) {
        return res.status(400).json({ message: "Tourist not found" });
      }
      //refund the tourist the money
      foundTourist.wallet += foundItinerary.price;

      //deduct back the loyalty points and update the tourist's loyalty level
      let pointsDeducted = 0;
      if (
        foundTourist.loyaltyLevel === "level 1" ||
        foundTourist.loyaltyLevel === "none"
      ) {
        pointsDeducted = foundItinerary.price * 0.5;
      } else if (foundTourist.loyaltyLevel === "level 2") {
        pointsDeducted = foundItinerary.price * 1;
      } else if (foundTourist.loyaltyLevel === "level 3") {
        pointsDeducted = foundItinerary.price * 1.5;
      }
      foundTourist.loyaltyPoints -= pointsDeducted;

      //remove the itinerary from the tourist's itineraries and remove the tourist from the itinerary's tourists
      foundTourist.itineraries = foundTourist.itineraries.filter(
        (itinerary) =>
          itinerary._id.toString() !== booking.itinerary._id.toString()
      );
      foundItinerary.boughtby = foundItinerary.boughtby.filter(
        (tourist) => tourist.toString() !== booking.tourist.toString()
      );
      await foundItinerary.save();
      await foundTourist.save();
    } else if (!booking.itinerary && booking.activity) {
      const foundActivity = await Activity.findById(booking.activity);
      if (!foundActivity) {
        return res.status(400).json({ message: "activity not found" });
      }
      const foundTourist = await User.findById(booking.tourist);
      if (!foundTourist) {
        return res.status(400).json({ message: "Tourist not found" });
      }
      //refund the tourist the money
      foundTourist.wallet += foundActivity.price;

      //deduct back the loyalty points and update the tourist's loyalty level
      let pointsDeducted = 0;
      if (
        foundTourist.loyaltyLevel === "level 1" ||
        foundTourist.loyaltyLevel === "none"
      ) {
        pointsDeducted = foundActivity.price * 0.5;
      } else if (foundTourist.loyaltyLevel === "level 2") {
        pointsDeducted = foundActivity.price * 1;
      } else if (foundTourist.loyaltyLevel === "level 3") {
        pointsDeducted = foundActivity.price * 1.5;
      }
      foundTourist.loyaltyPoints -= pointsDeducted;

      //remove the activity from the tourist's acttivities and remove the tourist from the activity's tourists
      foundTourist.acttivities = foundTourist.acttivities.filter(
        (activity) =>
          activity._id.toString() !== booking.activity._id.toString()
      );
      foundActivity.boughtby = foundActivity.boughtby.filter(
        (tourist) => tourist._id.toString() !== booking.tourist._id.toString()
      );
      await foundActivity.save();
      await foundTourist.save();
    } else {
      return res
        .status(400)
        .json({ message: "Booking itinerary or activity not found" });
    }

    booking.status = "cancelled";

    await booking.save();
    return res.status(200).json(booking);
  }
};

module.exports = {
  createBooking,
  bookHistoricalPlace,
  getBookings,
  updateBooking,
  deleteBooking,
  cancelBooking,
  cancelBookingHistoricalPlace,
};
