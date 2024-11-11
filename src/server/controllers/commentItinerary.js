const Comment = require("../models/Comment.js");

// Create a comment for a specific itinerary (optional itineraryId)
const createCommentForItinerary = async (req, res) => {
  try {
    const { itineraryId } = req.params; // Extracting the itinerary ID from the URL (optional)
    const { comment } = req.body;

    // Create a new comment document
    const newComment = new Comment({
      // If itineraryId is provided in the URL, use it; if not, set as null (optional)
      itinerary: itineraryId || null, // Itinerary is optional now, so we either use the passed value or set it to null
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
