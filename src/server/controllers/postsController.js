const Post = require("../models/Posts.js");

const createPost = async (req, res) => {
  try {
    const { details, price, currency, quantity, imageurl, createdby } = req.body;

    const newPost = new Post({
      details,
      price,
      currency,
      quantity,
      imageurl,
      createdby,
    });

    const savedPost = await newPost.save();

    res.status(201).json({
      message: "Post created successfully",
      post: savedPost,
    });
  } catch (err) {
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
    const postId = req.params.id;
    const { details, price, currency, quantity, imageurl, purchased ,review, rating } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { details, price, currency, quantity, imageurl,purchased ,review, rating},
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
module.exports = {
  createPost,
  getAllPosts,
  updatePostById,
  deletePostById,
  getAllPostsBySellerId,
  getPostById, // Export the new function
};
