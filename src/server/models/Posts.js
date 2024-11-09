const mongoose = require("mongoose");

const Posts = new mongoose.Schema(
  {
    details: String,
    price: Number,
    currency: String,
    quantity: Number,
      purchasedCount: Number,
    imageurl: String,
    reviews: {
      type: [String],
      default: [], // Set initial value to an empty array
    },
    
    purchased: {
      type: Boolean,
      default: false, // Set initial value to false
    },

    archived: {
      type: Boolean,
      default: false, // Set initial value to false
    },
    rating: {
      type: [Number], // Array of numbers
      default: [], // Default to an array with a single rating of 1
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
