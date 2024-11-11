const Comment = require("../models/Comment.js");
const Itinerary = require("../models/Itinerary.js"); // Import the Itinerary model
const Activity = require("../models/Activity.js"); // Import the Activity model
const User = require("../models/userModel.js"); // Import the User model
// Create a comment for a specific itinerary (optional itineraryId)
const createCommentForItinerary = async (req, res) => {
  try {
    const { itineraryId } = req.body; // Extracting the itinerary ID from the URL (optional)
    const { comment } = req.body;

    // Create a new comment document
    const newComment = new Comment({
      // If itineraryId is provided in the URL, use it; if not, set as null (optional)
      itinerary: itineraryId || null, // Itinerary is optional now, so we either use the passed value or set it to null
      comment,
    });
    //console.log(newComment);
    await newComment.save(); // Save the comment to the database
    res.status(201).json(newComment); // Respond with the created comment
  } catch (error) {
    //console.log(error);
    res.status(500).json({ message: "Error creating comment for itinerary", error });
  }
};

// Get all comments for a specific itinerary
const getCommentsByItinerary = async (req, res) => {
  try {
    const { itineraryId } = req.params; // Extracting the itinerary ID from the URL

    // Find all comments associated with the given itinerary ID
    const comments = await Comment.find({ itinerary: itineraryId });

    // Fetch related data for each comment
    const commentsWithDetails = await Promise.all(comments.map(async (comment) => {
      const itinerary = await Itinerary.findById(comment.itinerary);
      const activity = await Activity.findById(comment.activity);
      const tourGuide = await User.findById(comment.tourGuideId);
      return {
        ...comment.toObject(),
        itinerary,
        activity,
        tourGuide,
      };
    }));
    console.log(commentsWithDetails);
    res.status(200).json(commentsWithDetails); // Respond with the comments
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching comments for itinerary", error });
  }
};
// Export each function individually
module.exports = {
  createCommentForItinerary,
  getCommentsByItinerary,
};
