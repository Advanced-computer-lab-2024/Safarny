const Post = require("../models/Posts.js");
const axios = require("axios"); // Ensure axios is installed: npm install axios

const createPost = async (req, res) => {
  try {
    const { details, price, currency, quantity, imageurl, createdby } = req.body;
    console.log("details:", details, "price: ", price, "currency:", currency, "quantity:", quantity, "imageurl:", imageurl, "createdby:", createdby);
    const newPost = new Post({
      details,
      price,
      currency,
      quantity,
      purchasedCount: 0,
      imageurl,
      createdby,
      
    });

    const savedPost = await newPost.save();

    res.status(201).json({
      message: "Post created successfully",
      post: savedPost,
    });
  } catch (err) {
    //console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Controller to calculate total revenue
const getTotalRevenue = async (req, res) => {
  try {
    // Fetch exchange rates from an external API
    const apiUrl = "https://api.exchangerate-api.com/v4/latest/USD"; // Replace with your chosen API URL
    const { data } = await axios.get(apiUrl);

    if (!data || !data.rates) {
      return res.status(500).json({ error: "Failed to fetch exchange rates" });
    }

    const exchangeRates = data.rates; // Get rates for all currencies

    // Use aggregation to calculate total revenue dynamically in USD
    const posts = await Post.find(); // Replace with your Post model fetch logic

    // Calculate revenue for each post in USD
    const totalRevenueUSD = posts.reduce((total, post) => {
      const { price, currency, purchasedCount } = post;
      const rate = exchangeRates[currency] || 1; // Use 1 if currency is missing or not found
      const priceInUSD = price / rate; // Convert to USD
      return total + priceInUSD * purchasedCount; // Accumulate the revenue
    }, 0);

    // Apply commission (e.g., 10%)
    const totalRevenueWithCommission = totalRevenueUSD * 0.1;

    // Return the total revenue
    res.status(200).json({ totalRevenue: totalRevenueWithCommission });
  } catch (error) {
    console.error("Error calculating total revenue:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getRevenueBySeller = async (req, res) => {
  try {
    const { id } = req.params; // Seller's ID passed as a route parameter

    // Fetch exchange rates (assuming the same API as before)
    const apiUrl = "https://api.exchangerate-api.com/v4/latest/USD"; // Replace with a preferred API if needed
    const { data } = await axios.get(apiUrl);

    if (!data || !data.rates) {
      return res.status(500).json({ error: "Failed to fetch exchange rates" });
    }

    const exchangeRates = data.rates; // Get rates for all currencies

    // Aggregate revenue for posts created by the seller (createdby)
    const posts = await Post.find({ createdby: id });

    // Calculate total revenue in USD
    const totalRevenueUSD = posts.reduce((total, post) => {
      const { price, currency, purchasedCount } = post;
      const rate = exchangeRates[currency] || 1; // Default rate to 1 if currency is missing
      const priceInUSD = price / rate; // Convert price to USD
      const revenue = priceInUSD * (purchasedCount || 0); // Revenue = priceInUSD * number of purchases
      return total + revenue; // Accumulate the revenue
    }, 0);

    // Return the total revenue
    res.status(200).json({ totalRevenue: totalRevenueUSD*0.9 });
  } catch (error) {
    console.error("Error calculating revenue:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}; 




const getAllPostsBySellerId = async (req, res) => {
  try {
    const sellerId = req.params.sellerid;
    const posts = await Post.find({ createdby: sellerId }).populate(
      "createdby"
    );
    console.log(posts);
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePostById = async (req, res) => {
  try {
    const postId = req.params.id.trim();
    const { details, price, currency, quantity, imageurl, purchased, reviews, rating, archived, purchasedCount } = req.body;

    const updateData = { details, price, currency, quantity, imageurl, purchased, reviews, rating, archived };

    if (purchasedCount !== undefined) {
      updateData.purchasedCount = purchasedCount;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletePostById = async (req, res) => {
  try {
    const postId = req.params.id;

    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getPostById = async (req, res) => {
  try {
    const postId = req.params.id; // Extract the post ID from the request parameters
    const post = await Post.findById(postId); // Find the post by ID

    if (!post) {
      return res.status(404).json({ message: "Post not found" }); // Handle case where post is not found
    }

    res.status(200).json(post); // Return the found post
  } catch (err) {
    res.status(500).json({ error: err.message }); // Handle any errors that occur
  }
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
module.exports = {
  createPost,
  getAllPosts,
  updatePostById,
  deletePostById,
  getAllPostsBySellerId,
  getPostById, // Export the new function
  deletePostsByCreator,
  getTotalRevenue,
  getRevenueBySeller 
};
