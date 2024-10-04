const mongoose = require("mongoose");

const userModel = new mongoose.Schema(
  {
    //Default (Admin/ToursimGovernor/...)
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },

    //Role
    role: {
      type: String,
      enum: [
        "Admin",
        "TourismGovernor",
        "Tourist",
        "TourGuide",
        "Seller",
        "Advertiser",
      ],
      required: true,
    },

    //Tourist
    nationality: String,
    employed: String,
    wallet: { type: Number, default: 0 },
    DOB: Date,
    age: Number,
    mobile: String,

    //TourGuide
    YearOfExp: Number,
    PrevWork: String,

    //Seller
    description: String,
    sellerName: String,

    //Advertiser
    CompanyName: String,
    CompanyLink: String,
    CompanyHotline: Number,
  },
  {
    collection: "User",
  }
);

const User = mongoose.model("User", userModel);
module.exports = User;
