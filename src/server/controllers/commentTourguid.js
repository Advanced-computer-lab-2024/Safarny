const Comment = require("../models/Comment.js");

// Create a comment for a specific tour guide (optional tourGuideId)
const createCommentForTourGuide = async (req, res) => {
  try {
    const { tourGuideId } = req.body; // Extracting the tour guide ID from the URL (optional)
    const { comment } = req.body;

    // Create a new comment document
    const newComment = new Comment({
      // If tourGuideId is provided in the URL, use it; if not, set it to null (optional)
      tourGuideId: tourGuideId || null, // If no tourGuideId is provided, it will be set to null
      comment,
    });

    await newComment.save(); // Save the comment to the database
    res.status(201).json(newComment); // Respond with the created comment
  } catch (error) {
    res.status(500).json({ message: "Error creating comment for tour guide", error });
  }
};

// Get all comments for a specific tour guide
const getCommentsByTourGuide = async (req, res) => {
  try {
    const { tourGuideId } = req.params.id; // Extracting the tour guide ID from the URL

    // Find all comments associated with the given tour guide ID and populate related fields
    const comments = await Comment.find({ tourGuideId }).populate("itinerary activity tourGuideId");

    res.status(200).json(comments); // Respond with the comments
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments for tour guide", error });
  }
};

// Export each function individually
module.exports = {
  createCommentForTourGuide,
  getCommentsByTourGuide,
};
