const mongoose = require("mongoose");

const PromoCodeSchema = new mongoose.Schema(
  {
    discountPercentage: {
      type: Number,
      required: true,
    },
    activated: {
      type: Boolean,
      default: true, // Set initial value to true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    code: {
      type: String,
      required: true,
      unique: true, // Ensure the promo code is unique
    },
    expiryDate: {
      type: Date, // Optional: to add an expiry date for the promo code
    },
  },
  {
    collection: "PromoCodes", // Specify the collection name
  }
);

const PromoCode = mongoose.model("PromoCode", PromoCodeSchema);
module.exports = PromoCode;
