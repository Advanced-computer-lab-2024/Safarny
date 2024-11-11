const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema(
  { 
    itinerary: {
      type: Schema.Types.ObjectId,
      ref: "Itinerary",
      required: false,
    },
    activity: {
      type: Schema.Types.ObjectId,
      ref: "Activity",
      required: false,
    },
    typeOfComment: {
      type: String,
      required: false,
    },
    comment: {
      type: String,
      required: true,
    },
    tourGuideId: {
      type: Schema.Types.ObjectId,
      ref: "TourGuide",
      required: false,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
