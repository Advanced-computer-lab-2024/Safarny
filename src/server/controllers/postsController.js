const Post = require("../models/Posts.js");
const axios = require("axios"); // Ensure axios is installed: npm install axios
const Order = require("../models/Order.js");
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

const getFilteredAdminRevenue = async (req, res) => {
  try {
    const { month, year } = req.query; // Optional month and year filters

    // Step 1: Fetch all posts
    const posts = await Post.find().select("_id price currency");
    const postIds = posts.map((post) => post._id);

    if (postIds.length === 0) {
      return res.status(200).json({ totalRevenue: 0 }); // No posts found
    }

    // Step 2: Match orders for all posts
    const matchConditions = {
      "items.productId": { $in: postIds }, // Orders should include these post IDs
      status: { $in: ["confirmed", "delivered", "shipped", "pending"] }, // Filter orders based on status
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
          "items.productId": { $in: postIds }, // Ensure items belong to posts
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

    // Step 6: Return the total revenue (apply 10% commission)
    const adminCommission = totalRevenueUSD * 0.1; // 10% commission
    res.status(200).json({ totalRevenue: totalRevenueUSD, adminCommission });
  } catch (error) {
    console.error("Error calculating admin revenue:", error.message);
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
  getRevenueBySeller,
  getFilteredAdminRevenue 
};
