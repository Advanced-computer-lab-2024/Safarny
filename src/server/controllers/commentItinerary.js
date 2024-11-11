const Comment = require("../models/Comment.js");

// Create a comment for a specific itinerary
const createCommentForItinerary = async (req, res) => {
  try {
    const { itineraryId } = req.params; // Extracting the itinerary ID from the URL
    const { comment } = req.body;

    // Create a new comment document with the itinerary ID
    const newComment = new Comment({
      itinerary: itineraryId,
      // tourGuideId,
      // activity,
      // typeOfComment,
      comment,
    });

    await newComment.save(); // Save the comment to the database
    res.status(201).json(newComment); // Respond with the created comment
  } catch (error) {
    res.status(500).json({ message: "Error creating comment for itinerary", error });
  }
};

// Get all comments for a specific itinerary
const getCommentsByItinerary = async (req, res) => {
  try {
    const { itineraryId } = req.params; // Extracting the itinerary ID from the URL

    // Find all comments associated with the given itinerary ID and populate related fields
    const comments = await Comment.find({ itinerary: itineraryId }).populate("itinerary activity tourGuideId");

    res.status(200).json(comments); // Respond with the comments
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments for itinerary", error });
  }
};

// Export each function individually
module.exports = {
  createCommentForItinerary,
  getCommentsByItinerary,
};
