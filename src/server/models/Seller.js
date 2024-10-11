const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sellerSchema = new Schema(
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
      type: String, // Changed to String for security (passwords should be strings)
      required: true,
    },
    image: { // New field for profile image
      type: String,
      default: '' // Default to an empty string if no image is provided
    },
  },
  { timestamps: true }
);

const Seller = mongoose.model("Seller", sellerSchema);
module.exports = Seller;
