const mongoose = require("mongoose");

const Posts = new mongoose.Schema(
  {
    details: String,
    price: Number,
    quantity: Number,
    imageurl: String,
  },
  {
    collection: "Posts",
  }
);

const Post = mongoose.model("Posts", Posts);
module.exports = Post;
