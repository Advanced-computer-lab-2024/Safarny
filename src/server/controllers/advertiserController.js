const User = require("../models/userModel.js");
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken"); // Ensure you have imported jwt
const dotenv = require("dotenv");
const axios = require("axios"); // Ensure axios is installed: npm install axios
const Activity = require("../models/Activity.js");
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
    res.status(200).json({ totalRevenue: totalRevenueUSD });
  } catch (error) {
    console.error("Error calculating revenue:", error.message);
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

module.exports = {
  createAdvertiser,
  getAdvertisers,
  updateAdvertiser,
  deleteAdvertiser,
  getRevenueByAdvertiser,
  getBoughtCountByAdvertiser,
  getBoughtCountByActivity,
};
