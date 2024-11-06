import mongoose from "mongoose";
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
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
export default Comment;
