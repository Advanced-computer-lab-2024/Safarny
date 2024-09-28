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




import HistoricalPlace from "../models/historicalplaces.js";

// Controller for creating a new historical place
export const createHistoricalPlace = async (req, res) => {
  try {
    const { description, pictures, location, openingHours, ticketPrices } = req.body;

    // Create a new Historical Place
    const newPlace = new HistoricalPlace({
      description,
      pictures,
      location,
      openingHours,
      ticketPrices,
    });

    // Save the new place to the database
    const savedPlace = await newPlace.save();

    res.status(201).json({
      message: 'Historical place created successfully',
      place: savedPlace,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controller to get all historical places
export const getAllHistoricalPlaces = async (req, res) => {
  try {
    const places = await HistoricalPlace.find(); // Fetch all historical places
    res.status(200).json(places);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controller to get a historical place by ID
export const getHistoricalPlaceById = async (req, res) => {
  try {
    const placeId = req.params.id;

    // Find the place by its ID
    const place = await HistoricalPlace.findById(placeId);

    if (!place) {
      return res.status(404).json({ message: 'Historical place not found' });
    }

    res.status(200).json(place);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controller to update a historical place by its _id
export const updateHistoricalPlaceById = async (req, res) => {
  try {
    const placeId = req.params.id;
    const { description, pictures, location, openingHours, ticketPrices } = req.body;

    // Find the place by its ID and update it with new data
    const updatedPlace = await HistoricalPlace.findByIdAndUpdate(
      placeId,
      { description, pictures, location, openingHours, ticketPrices },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedPlace) {
      return res.status(404).json({ message: 'Historical place not found' });
    }

    res.status(200).json({
      message: 'Historical place updated successfully',
      place: updatedPlace,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controller to delete a historical place by its _id
export const deleteHistoricalPlaceById = async (req, res) => {
  try {
    const placeId = req.params.id;

    // Find the place by its ID and delete it
    const deletedPlace = await HistoricalPlace.findByIdAndDelete(placeId);

    if (!deletedPlace) {
      return res.status(404).json({ message: 'Historical place not found' });
    }

    res.status(200).json({ message: 'Historical place deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




