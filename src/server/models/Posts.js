const mongoose = require("mongoose");

const Posts = new mongoose.Schema(
  {
    details: String,
    price: Number,
    currency: String,
    quantity: Number,
    imageurl: String,
    review: {
      type: String,
      default: "no reviews", // Set initial value to "no reviews"
    },
    purchased: {
      type: Boolean,
      default: false, // Set initial value to false
    },
    rating: {
      type: Number,
      min: 1, // Minimum rating value
      max: 5, // Maximum rating value
      default: 0, // Default rating value (could be 0 or a placeholder)
    },
    createdby:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  },
  {
    collection: "Posts",
  }
);

const Post = mongoose.model("Posts", Posts);
module.exports = Post;
