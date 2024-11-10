const mongoose = require("mongoose"); // Use require instead of import
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  { 
    itinerary: {
      type: Schema.Types.ObjectId,
      ref: "Itinerary",
      required: true,
    },
    activity: {
      type: Schema.Types.ObjectId,
      ref: "Activity",
      required: true,
    },
    typeOfComment: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    tourGuideId: {
      type: Schema.Types.ObjectId,
      ref: "TourGuide",
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment; // Use module.exports instead of export default
