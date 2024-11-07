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
    wallet: { type: Number, default: 0},
    walletcurrency: { type: String, default: "USD" },
    DOB: Date,
    age: Number,
    mobile: String,
    loyaltyPoints: { type: Number, default: 0 },
    loyaltyLevel: {
      type: String,
      enum: ["none", "level 1", "level 2", "level 3"],
      default: "none",
    },

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
    //Tourist/Advertiser
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

userModel.methods.updateLoyaltyLevel = function () {
  if (this.loyaltyPoints > 500000) {
    this.loyaltyLevel = "level 3";
  } else if (this.loyaltyPoints > 100000) {
    this.loyaltyLevel = "level 2";
  } else if (this.loyaltyPoints > 0) {
    this.loyaltyLevel = "level 1";
  } else {
    this.loyaltyLevel = "none";
  }
  return this.loyaltyLevel;
};

userModel.pre("save", function (next) {
  this.updateLoyaltyLevel();
  next();
});

const User = mongoose.model("User", userModel);
module.exports = User;
