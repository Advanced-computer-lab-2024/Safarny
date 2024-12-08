
const User = require("../models/userModel.js");
const { default: mongoose } = require("mongoose");
const Order = require("../models/Order"); // Replace with the correct path to your Order model
const Post = require("../models/Posts");   // Replace with the correct path to your Post model
const jwt = require("jsonwebtoken"); // Ensure you have imported jwt
const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();

const createSeller = async (req, res) => {
  const { username, email, password, role, description, sellerName } = req.body;
  try {
    const newSeller = new User({
      email,
      username,
      password,
      description,
      sellerName,
      role: "Seller",
    });
    const token = jwt.sign({ id: newSeller._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.LOGIN_EXPIRES_IN,
    });
    await newSeller.save();
    res.status(201).json({
      token,
      data: { user: newSeller },
      message: `user with role ${role} registered successfully`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSellers = async (req, res) => {
  const sellers = await User.find({ role: "Seller" });
  res.status(200).json(sellers);
};

const updateSeller = async (req, res) => {
  const { username, email, password } = req.body;

  const updatedSeller = await User.findOneAndUpdate(
    { email, role: "Seller" },
    { username, password },
    { new: true }
  );
  res.status(200).json(updatedSeller);
};

const deleteSeller = async (req, res) => {
  const { email } = req.body;

  await User.findOneAndDelete({ email });
  res.status(200).json({ message: "Seller deleted successfully" });
};
const deletePostsByCreator = async (req, res) => {
  try {
    const creatorId = req.params.creatorId; // Retrieve the creator's ID from the request parameters

    // Use deleteMany to delete all posts created by the specified user
    const result = await Post.deleteMany({ createdby: creatorId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    res.status(200).json({ message: "All posts by the user have been deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getFilteredRevenueBySeller = async (req, res) => {
  try {
    const { id } = req.params; // Seller ID
    const { month, year } = req.query; // Optional month and year filters

    // Step 1: Fetch posts created by the seller
    const posts = await Post.find({ createdby: id }).select("_id price currency");
    const postIds = posts.map((post) => post._id);

    if (postIds.length === 0) {
      return res.status(200).json({ totalRevenue: 0 }); // No posts found for the seller
    }

    // Step 2: Match orders for the seller's posts
    const matchConditions = {
      "items.productId": { $in: postIds },
      status: { $in: ["confirmed", "delivered","shipped","pending"] }, // Filter orders based on status
    };

    // Add date filters if month/year are provided
    if (month || year) {
      matchConditions.$expr = {
        $and: [],
      };

      if (month) {
        matchConditions.$expr.$and.push({
          $eq: [{ $month: "$createdAt" }, parseInt(month)],
        });
      }

      if (year) {
        matchConditions.$expr.$and.push({
          $eq: [{ $year: "$createdAt" }, parseInt(year)],
        });
      }
    }

    // Step 3: Aggregate orders and calculate revenue
    const orders = await Order.aggregate([
      {
        $match: matchConditions, // Match orders based on conditions
      },
      {
        $unwind: "$items", // Flatten the items array to access individual items
      },
      {
        $match: {
          "items.productId": { $in: postIds }, // Ensure items belong to the seller's posts
        },
      },
      {
        $group: {
          _id: "$items.currency", // Group by currency
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }, // Calculate total revenue
        },
      },
    ]);

    // Step 4: Fetch exchange rates (example: USD base rates)
    const apiUrl = "https://api.exchangerate-api.com/v4/latest/USD";
    const { data } = await axios.get(apiUrl);

    if (!data || !data.rates) {
      return res.status(500).json({ error: "Failed to fetch exchange rates" });
    }

    const exchangeRates = data.rates;

    // Step 5: Convert revenue to USD and calculate total
    let totalRevenueUSD = 0;
    orders.forEach((order) => {
      const { _id: currency, totalRevenue } = order;
      const exchangeRate = exchangeRates[currency] || 1;
      const convertedRevenue = totalRevenue / exchangeRate;
      totalRevenueUSD += convertedRevenue;
    });

    // Step 6: Return the total revenue (apply 10% deduction if needed)
    res.status(200).json({ totalRevenue: totalRevenueUSD * 0.9 });
  } catch (error) {
    console.error("Error calculating revenue for seller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = { createSeller, getSellers, updateSeller, deleteSeller, deletePostsByCreator,getFilteredRevenueBySeller };
