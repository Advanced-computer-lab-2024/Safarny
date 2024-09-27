import Post from "../models/Posts.js";

// Controller for creating a new post (product)
export const createPost = async (req, res) => {
  try {
    const { details, price, quantity, imageurl } = req.body;

    // Create a new Post (Product)
    const newPost = new Post({
      details,
      price,
      quantity,
      imageurl,
    });

    // Save the new post to the database
    const savedPost = await newPost.save();

    res.status(201).json({
      message: 'Post created successfully',
      post: savedPost,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controller to get all posts (products)
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find(); // Fetch all posts
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controller to update a post (product) by its _id
export const updatePostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const { details, price, quantity, imageurl } = req.body;

    // Find the post by its ID and update it with new data
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { details, price, quantity, imageurl },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({
      message: 'Post updated successfully',
      post: updatedPost,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controller to delete a post (product) by its _id
export const deletePostById = async (req, res) => {
  try {
    const postId = req.params.id;

    // Find the post by its ID and delete it
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



