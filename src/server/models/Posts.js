const mongoose = require("mongoose");

const Posts = new mongoose.Schema(
  {
    details: String,
    price: Number,
    currency: String,
    quantity: Number,
    imageurl: String,
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
