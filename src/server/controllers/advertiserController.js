const User = require("../models/userModel.js");
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken"); // Ensure you have imported jwt
const dotenv = require("dotenv");
const axios = require("axios"); // Ensure axios is installed: npm install axios
const Activity = require("../models/Activity.js");
const Booking = require("../models/Booking.js");
dotenv.config();

const createAdvertiser = async (req, res) => {
  const {
    username,
    email,
    password,
    role,
    CompanyName,
    CompanyLink,
    CompanyHotline,
  } = req.body;
  const newAdvertiser = new User({
    username,
    email,
    password,
    CompanyName,
    CompanyLink,
    CompanyHotline,
    role: "Advertiser",
  });
  const token = jwt.sign({ id: newAdvertiser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.LOGIN_EXPIRES_IN,
  });
  await newAdvertiser.save();
  res.status(201).json({
    token,
    data: { user: newAdvertiser },
    message: `user with role ${role} registered successfully`,
  });
};

const getAdvertisers = async (req, res) => {
  const advertisers = await User.find({ role: "Advertiser" });
  res.status(200).json(advertisers);
};

const updateAdvertiser = async (req, res) => {
  const { username, email, password } = req.body;

  const updatedAdvertiser = await User.findOneAndUpdate(
    { email, role: "Advertiser" },
    { username, password },
    { new: true }
  );
  res.status(200).json(updatedAdvertiser);
};

const deleteAdvertiser = async (req, res) => {
  const { email } = req.body;

  await User.findOneAndDelete({ email });
  res.status(200).json({ message: "Advertiser deleted successfully" });
};

const getRevenueByAdvertiser = async (req, res) => {
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
    res.status(200).json({ totalRevenue: totalRevenueUSD*0.9 });
  } catch (error) {
    console.error("Error calculating revenue:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTouristsByActivityAndDate = async (req, res) => {
  try {
    const { advertiserId } = req.params; // Advertiser ID
    const { month, year } = req.query; // Optional month and year filters

    // Step 1: Match activities created by the advertiser
    const activities = await Activity.find({ createdby: advertiserId }).select("_id");
    const activityIds = activities.map((activity) => activity._id);

    // Step 2: Build dynamic match conditions
    const matchConditions = {
      activity: { $in: activityIds },
      status: { $in: ["confirmed", "active"] }, // Only include confirmed or active bookings
    };

    if (month || year) {
      matchConditions.$expr = {
        $and: [],
      };

      if (month) {
        matchConditions.$expr.$and.push({ $eq: [{ $month: { $dateFromString: { dateString: "$bookingDate" } } }, parseInt(month)] });
      }
      if (year) {
        matchConditions.$expr.$and.push({ $eq: [{ $year: { $dateFromString: { dateString: "$bookingDate" } } }, parseInt(year)] });
      }
    }

    // Step 3: Aggregate bookings
    const result = await Booking.aggregate([
      { $match: matchConditions }, // Match based on dynamic conditions
      {
        $group: {
          _id: "$activity", // Group by activity
          totalTourists: { $sum: 1 }, // Count the number of tourists
        },
      },
    ]);

    res.status(200).json(result); // Return the result
  } catch (error) {
    console.error("Error filtering by activity and date:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};



const getBoughtCountByAdvertiser = async (req, res) => {
  try {
    const { id } = req.params; // Advertiser's ID passed as a route parameter

    // Aggregate the activities based on the createdby field (advertiser)
    const result = await Activity.aggregate([
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

const getBoughtCountByActivity = async (req, res) => {
  const { id } = req.params; // Get activity ID from request parameters

  try {
      // Find the activity by its ID and only project the `boughtby` field
      const activity = await Activity.findById(id).select('boughtby');

      if (!activity) {
          return res.status(404).json({ message: 'Activity not found' });
      }

      // Return the length of the `boughtby` array
      res.status(200).json({ boughtCount: activity.boughtby.length });
  } catch (error) {
      console.error('Error fetching bought count:', error);
      res.status(500).json({ message: 'An error occurred', error });
  }
};

const filteredRevenueByAdvertiser = async (req, res) => {
  try {
    const { id } = req.params; // Advertiser ID
    const { month, year } = req.query; // Optional month and year filters

    // Step 1: Fetch exchange rates
    const apiUrl = "https://api.exchangerate-api.com/v4/latest/USD"; // Replace with a preferred API if needed
    const { data } = await axios.get(apiUrl);

    if (!data || !data.rates) {
      return res.status(500).json({ error: "Failed to fetch exchange rates" });
    }

    const exchangeRates = data.rates; // Exchange rates mapping (e.g., { EGP: 30, EUR: 0.92 })

    // Step 2: Match activities created by the advertiser
    const activities = await Activity.find({ createdby: id }).select("_id price currency");
    const activityIds = activities.map((activity) => activity._id);

    // Step 3: Build dynamic match conditions for bookings
    const matchConditions = {
      activity: { $in: activityIds }, // Bookings for advertiser's activities
      status: { $in: ["confirmed", "active"] }, // Only include confirmed bookings
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

    // Step 4: Aggregate bookings and calculate revenue in original currency
    const bookings = await Booking.aggregate([
      { $match: matchConditions }, // Match based on conditions
      {
        $lookup: {
          from: "activities", // Join with Activity collection
          localField: "activity",
          foreignField: "_id",
          as: "activityDetails",
        },
      },
      { $unwind: "$activityDetails" }, // Flatten the joined data
      {
        $group: {
          _id: "$activityDetails.currency", // Group by currency
          totalRevenue: { $sum: { $multiply: ["$activityDetails.price", 1] } }, // Revenue in original currency
        },
      },
    ]);

    // Step 5: Convert total revenue for each currency into USD
    let totalRevenueUSD = 0;
    bookings.forEach((booking) => {
      const { _id: currency, totalRevenue } = booking; // currency and revenue in that currency
      const exchangeRate = exchangeRates[currency] || 1; // Default rate to 1 if missing
      const convertedRevenue = totalRevenue / exchangeRate; // Convert to USD
      totalRevenueUSD += convertedRevenue; // Accumulate converted revenue
    });

    // Return the total revenue
    res.status(200).json({ totalRevenue: totalRevenueUSD * 0.9 }); // Apply 10% deduction
  } catch (error) {
    console.error("Error calculating revenue:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};





module.exports = {
  createAdvertiser,
  getAdvertisers,
  updateAdvertiser,
  deleteAdvertiser,
  getRevenueByAdvertiser,
  getBoughtCountByAdvertiser,
  getBoughtCountByActivity,
  getTouristsByActivityAndDate,
  filteredRevenueByAdvertiser,
};
