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

    //Tourist/TourGuide
    itineraries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Itinerary",
      },
    ],

    //Seller
    description: String,
    sellerName: String,
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts",
      },
    ],

    //Advertiser
    CompanyName: String,
    CompanyLink: String,
    CompanyHotline: Number,
    acttivities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],

    //TourismGovernor
    historicalPlaces: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "historicalplaces",
      },
    ],

    //TourismGovernor/Admin
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tags",
      },
    ],

    //Admin
    activityCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ActivityCategory",
      },
    ],

    Status: {
      type: String,
      default: "Not Accepted",
    },
  },
  {
    collection: "User",
  }
);

const User = mongoose.model("User", userModel);
module.exports = User;
