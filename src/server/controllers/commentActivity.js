const Comment = require("../models/Comment.js");

// Create a comment for a specific activity
const createCommentForActivity = async (req, res) => {
  try {
    const { activityId } = req.params; // Extracting the activity ID from the URL
    const { comment } = req.body;

    // Create a new comment document with the activity ID
    const newComment = new Comment({
      activity: activityId,
      // tourGuideId,
      // itinerary,
      // typeOfComment,
      comment,
    });

    await newComment.save(); // Save the comment to the database
    res.status(201).json(newComment); // Respond with the created comment
  } catch (error) {
    res.status(500).json({ message: "Error creating comment for activity", error });
  }
};

// Get all comments for a specific activity
const getCommentsByActivity = async (req, res) => {
  try {
    const { activityId } = req.params; // Extracting the activity ID from the URL

    // Find all comments associated with the given activity ID and populate related fields
    const comments = await Comment.find({ activity: activityId }).populate("itinerary activity tourGuideId");

    res.status(200).json(comments); // Respond with the comments
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments for activity", error });
  }
};

// Export each function directly
module.exports = {
  createCommentForActivity,
  getCommentsByActivity,
};
