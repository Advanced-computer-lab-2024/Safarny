const Comment = require("../models/Comment.js");
const User = require("../models/userModel.js");
const Itinerary = require("../models/Itinerary.js"); // Import the Itinerary model

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
    const { tourGuideId } = req.params;
    console.log(tourGuideId);

    // Check if the tourGuideId exists
    const tourGuideExists = await User.exists({ _id: tourGuideId });
    if (!tourGuideExists) {
      return res.status(404).json({ message: 'Tour guide not found' });
    }

    // Fetch comments by tourGuideId
    const comments = await Comment.find({ tourGuideId });

    // Fetch related data for each comment
    const commentsWithDetails = await Promise.all(comments.map(async (comment) => {
      const itinerary = await Itinerary.findById(comment.itinerary);
      //const activity = await Activity.findById(comment.activity);
      return {
        ...comment.toObject(),
        itinerary,
        //activity,
      };
    }));

    //console.log(commentsWithDetails);
    res.status(200).json(commentsWithDetails);
  } catch (error) {
    //console.log(error);
    res.status(500).json({ message: 'Error fetching comments for tour guide', error });
  }
};

// Export each function individually
module.exports = {
  createCommentForTourGuide,
  getCommentsByTourGuide,
};