const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Activity = require("../models/Activity.js");
const axios = require("axios"); // Ensure axios is installed: npm install axios
const Itinerary = require("../models/Itinerary.js");
const Booking = require("../models/Booking.js");
dotenv.config();

const createTourGuide = async (req, res) => {
  console.log(req.body)
  const { username, email, password,mobile, role, YearOfExp, PrevWork } = req.body;
  const newTourGuide = new User({
    username,
    email,
    password,
    mobile,
    YearOfExp,
    PrevWork,
    role: "TourGuide",
  });
  const token = jwt.sign({ id: newTourGuide._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.LOGIN_EXPIRES_IN,
  });
  await newTourGuide.save();
  res.status(201).json({
    token,
    data: { user: newTourGuide },
    message: `user with role ${role} registered successfully`,
  });
};

const getTourGuides = async (req, res) => {
  const tourGuides = await User.find({ role: "TourGuide" });
  res.status(200).json(tourGuides);
};

const updateTourGuide = async (req, res) => {
  const { username, email, password, newRating } = req.body;

  try {
    const updatedTourGuide = await User.findOneAndUpdate(
      { email, role: "TourGuide" },
      { username, password },
      { new: true }
    );

    if (!updatedTourGuide) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    if (newRating) {
      // Add the new rating to the ratings array
      updatedTourGuide.rating.push(newRating);

      // Calculate the new average rating
      const totalRatings = updatedTourGuide.rating.length;
      const sumRatings = updatedTourGuide.rating.reduce((sum, rate) => sum + rate, 0);
      updatedTourGuide.averageRating = sumRatings / totalRatings;

      // Save the updated tour guide
      await updatedTourGuide.save();
    }

    res.status(200).json(updatedTourGuide);
  } catch (error) {
    console.error("Error updating tour guide:", error);
    res.status(500).json({ message: "Error updating tour guide." });
  }
};

const deleteTourGuide = async (req, res) => {
  const { email } = req.body;

  await User.findOneAndDelete({ email });
  res.status(200).json({ message: "Tour guide deleted successfully" });
};


//update average rating



const updateAverageRatingById = async (req, res) => {
  try {
    const { id, newRating } = req.body;

    // Convert the ID to a string
    const stringId = String(id);
    console.log("Received ID:", stringId);

    // Check if the id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(stringId)) {
      return res.status(400).json({ message: "Invalid tour guide ID" });
    }

    // Find the tour guide by ID
    const tourGuide = await User.findById(stringId);

    if (!tourGuide) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    // Initialize the rating array if it doesn't exist
    if (!Array.isArray(tourGuide.rating)) {
      tourGuide.rating = [];
    }

    console.log("Rating before push:", tourGuide.rating);
    // Add the new rating to the ratings array
    tourGuide.rating.push(newRating);
    console.log("Rating after push:", tourGuide.rating);

    // Calculate the new average rating
    const totalRatings = tourGuide.rating.length;
    const sumRatings = tourGuide.rating.reduce((sum, rate) => sum + rate, 0);
    tourGuide.averageRating = sumRatings / totalRatings;

    // Save the updated tour guide
    await tourGuide.save();

    return res.status(200).json(tourGuide);
  } catch (error) {
    console.error("Error updating average rating:", error);
    return res.status(500).json({ message: "Error updating average rating" });
  }
};


const getActivityRevenueByTourGuide = async (req, res) => {
  try {
    const { id } = req.params; // Tour guide ID passed as a route parameter

    // Fetch exchange rates
    const apiUrl = "https://api.exchangerate-api.com/v4/latest/USD"; // Replace with a preferred API if needed
    const { data } = await axios.get(apiUrl);

    if (!data || !data.rates) {
      return res.status(500).json({ error: "Failed to fetch exchange rates" });
    }

    const exchangeRates = data.rates; // Get rates for all currencies

    // Aggregate revenue of activities created by the tour guide
    const activities = await Activity.find({ createdby: id });

    // Calculate total revenue in USD
    const totalRevenueUSD = activities.reduce((total, activity) => {
      const { price, currency, boughtby } = activity;
      const rate = exchangeRates[currency] || 1; // Default rate to 1 if currency is missing
      const priceInUSD = price / rate; // Convert price to USD
      const revenue = priceInUSD * (boughtby?.length || 0); // Revenue = priceInUSD * number of buyers
      return total + revenue; // Accumulate the revenue
    }, 0);

    // Return the total revenue
    res.status(200).json({ totalRevenue: totalRevenueUSD });
  } catch (error) {
    console.error("Error calculating revenue:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getItineraryRevenueByTourGuide = async (req, res) => {
  try {
    const { id } = req.params; // Tour guide ID passed as a route parameter

    // Fetch exchange rates
    const apiUrl = "https://api.exchangerate-api.com/v4/latest/USD"; // Replace with a preferred API if needed
    const { data } = await axios.get(apiUrl);

    if (!data || !data.rates) {
      return res.status(500).json({ error: "Failed to fetch exchange rates" });
    }

    const exchangeRates = data.rates; // Get rates for all currencies

    // Aggregate revenue of activities created by the tour guide
    const activities = await Itinerary.find({ createdby: id });

    // Calculate total revenue in USD
    const totalRevenueUSD = activities.reduce((total, activity) => {
      const { price, currency, boughtby } = activity;
      const rate = exchangeRates[currency] || 1; // Default rate to 1 if currency is missing
      const priceInUSD = price / rate; // Convert price to USD
      const revenue = priceInUSD * (boughtby?.length || 0); // Revenue = priceInUSD * number of buyers
      return total + revenue; // Accumulate the revenue
    }, 0);

    // Return the total revenue
    res.status(200).json({ totalRevenue: totalRevenueUSD*0.9 });
  } catch (error) {
    console.error("Error calculating revenue:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getBoughtCountByTourGuide = async (req, res) => {
  try {
    const { id } = req.params; // Advertiser's ID passed as a route parameter

    // Aggregate the activities based on the createdby field (advertiser)
    const result = await Itinerary.aggregate([
      {
        $match: {
          createdby: new mongoose.Types.ObjectId(id), // Ensure ObjectId is created with 'new'
        },
      },
      {
        $project: {
          boughtCount: { $size: "$boughtby" }, // Calculate the length of the boughtby array
        },
      },
      {
        $group: {
          _id: "$createdby", // Group by the advertiser (createdby)
          totalBought: { $sum: "$boughtCount" }, // Sum up the lengths of boughtby arrays
        },
      },
    ]);

    // If no activities are found
    if (result.length === 0) {
      return res.status(200).json({ totalBought: 0 });
    }

    // Return the total count of users who bought activities for the specific advertiser
    res.status(200).json({ totalBought: result[0].totalBought });
  } catch (error) {
    console.error("Error calculating bought count:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const filteredRevenueByTourGuide = async (req, res) => {
  try {
    const { id } = req.params; // TourGuide ID
    const { month, year } = req.query; // Optional month and year filters

    // Step 1: Fetch exchange rates
    const apiUrl = "https://api.exchangerate-api.com/v4/latest/USD";
    const { data } = await axios.get(apiUrl);

    if (!data || !data.rates) {
      return res.status(500).json({ error: "Failed to fetch exchange rates" });
    }

    const exchangeRates = data.rates;

    // Step 2: Find itineraries managed by the TourGuide
    const itineraries = await Itinerary.find({ createdby: id }).select("_id price currency");
    const itineraryIds = itineraries.map((itinerary) => itinerary._id);

    if (itineraryIds.length === 0) {
      return res.status(200).json({ totalRevenue: 0 }); // No itineraries found
    }

    // Step 3: Match bookings for the TourGuide's itineraries
    const matchConditions = {
      itinerary: { $in: itineraryIds },
      status: { $in: ["confirmed", "active"] },
    };

    if (month || year) {
      matchConditions.$expr = {
        $and: [],
      };

      if (month) {
        matchConditions.$expr.$and.push({
          $eq: [{ $month: { $dateFromString: { dateString: "$bookingDate" } } }, parseInt(month)],
        });
      }
      if (year) {
        matchConditions.$expr.$and.push({
          $eq: [{ $year: { $dateFromString: { dateString: "$bookingDate" } } }, parseInt(year)],
        });
      }
    }

    // Step 4: Aggregate bookings and calculate revenue
    const bookings = await Booking.aggregate([
      { 
        $match: matchConditions // Match conditions for filtering bookings
      },
      {
        $lookup: {
          from: "itineraries", // Join with the Itinerary collection
          localField: "itinerary", // Field in Booking referencing Itinerary
          foreignField: "_id", // Field in Itinerary being referenced
          as: "itineraryDetails",
        },
      },
      { 
        $unwind: "$itineraryDetails" // Flatten the joined data
      },
      {
        $group: {
          _id: "$itineraryDetails.currency", // Group by currency
          totalRevenue: { $sum: { $multiply: ["$itineraryDetails.price", 1] } }, // Sum the price fields
        },
      },
    ]);
    

    // Step 5: Convert to USD
    let totalRevenueUSD = 0;
    bookings.forEach((booking) => {
      const { _id: currency, totalRevenue } = booking;
      const exchangeRate = exchangeRates[currency] || 1;
      const convertedRevenue = totalRevenue / exchangeRate;
      totalRevenueUSD += convertedRevenue;
    });

    // Return the total revenue
    res.status(200).json({ totalRevenue: totalRevenueUSD * 0.9 }); // Apply 10% deduction
  } catch (error) {
    console.error("Error calculating revenue for tour guide:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  createTourGuide,
  getTourGuides,
  updateTourGuide,
  deleteTourGuide,
  updateAverageRatingById,
  getActivityRevenueByTourGuide,
  getItineraryRevenueByTourGuide,
  getBoughtCountByTourGuide,
  filteredRevenueByTourGuide
};
