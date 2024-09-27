import mongoose from "mongoose";

const Posts = new mongoose.Schema(
  {
    details: String,
    price: Number,
    quantity: Number,
    imageurl:String,
  },
  {
    collection: "Posts",
  }
);

const Post = mongoose.model("Posts", Posts);
export default Post;
