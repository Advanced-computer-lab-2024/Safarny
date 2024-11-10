import Comment from "../models/Comment.js";

const tourGuideCommentController = {
  // Create a comment for a specific tour guide
  createCommentForTourGuide: async (req, res) => {
    try {
      const { tourGuideId } = req.params; // Extracting the tour guide ID from the URL
      const { comment } = req.body;

      // Create a new comment document with the tour guide ID
      const newComment = new Comment({
        tourGuideId,
        // itinerary,
        // activity,
        // typeOfComment,
        comment,
      });

      await newComment.save(); // Save the comment to the database
      res.status(201).json(newComment); // Respond with the created comment
    } catch (error) {
      res.status(500).json({ message: "Error creating comment for tour guide", error });
    }
  },

  // Get all comments for a specific tour guide
  getCommentsByTourGuide: async (req, res) => {
    try {
      const { tourGuideId } = req.params; // Extracting the tour guide ID from the URL

      // Find all comments associated with the given tour guide ID and populate related fields
      const comments = await Comment.find({ tourGuideId }).populate("itinerary activity tourGuideId");

      res.status(200).json(comments); // Respond with the comments
    } catch (error) {
      res.status(500).json({ message: "Error fetching comments for tour guide", error });
    }
  },
};

export default tourGuideCommentController;
