import mongoose from "mongoose";
const { Schema } = mongoose;

const tourGuideSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: false,
    },
    yearsOfExperience: {
      type: Number,
      required: false,
    },
    previousWork: {
      type: String,
        required: false,
    },
  },
  { timestamps: true }
);

const TourGuide = mongoose.model("TourGuide", tourGuideSchema);
export default TourGuide;