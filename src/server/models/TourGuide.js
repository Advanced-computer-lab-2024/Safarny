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
      rating: {
          type: [Number], // Array of numbers
          default: [5], // Default to an array with a single rating of 5
      },
        averageRating: { type: Number, default: 5 }, // Default average rating to 5
  },
  { timestamps: true }
);

const TourGuide = mongoose.model("TourGuide", tourGuideSchema);
export default TourGuide;