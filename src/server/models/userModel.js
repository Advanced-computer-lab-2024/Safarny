const mongoose = require("mongoose");

const userModel = new mongoose.Schema(
  {
    // Default (Admin/TourismGovernor/...)
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },

    // Role
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

    // Tourist
    nationality: String,
    employed: String,
    wallet: { type: Number, default: 0 },
    walletcurrency: { type: String, default: "USD" },
    DOB: Date,
    age: Number,
    mobile: String,
      promos: [
          {
              type: mongoose.Schema.Types.ObjectId,
              ref: "PromoCode",
          },
      ],
    addresses: {
      type: [String],
      default: [],
    },
    loyaltyPoints: { type: Number, default: 0 },
    totalLoyaltyPoints: { type: Number, default: 0 },
    loyaltyLevel: {
      type: String,
      enum: ["none", "level 1", "level 2", "level 3"],
      default: "none",
    },

    // TourGuide
    YearOfExp: Number,
    PrevWork: String,
    delete_request: { type: Boolean, default: false },
    // Tourist/TourGuide
    itineraries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Itinerary",
      },
    ],
    rating: {
      type: [Number], // Array of numbers
      default: [], // Default to an array with a single rating of 5
    },
    averageRating: { type: Number, default: 5 }, // Default average rating to 5

    // Seller
    description: String,
    sellerName: String,
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts",
      },
    ],

    cart: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts",
      },
    ],

    // Advertiser
    CompanyName: String,
    CompanyLink: String,
    CompanyHotline: Number,
    // Tourist/Advertiser
    activities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],

    // TourismGovernor
    historicalPlaces: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "historicalplaces",
      },
    ],

    // TourismGovernor/Admin
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tags",
      },
    ],

    // Admin
    activityCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ActivityCategory",
      },
    ],
    // firebase storage photo URL
    photo: String,

    Status: {
      type: String,
      default: "Not Accepted",
    },
    preferencestags: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tags'
    }],

    // Add this new field for historical preference tags
    preferedhistoricaltags: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HistoricalTags'
    }],
  },
  {
    collection: "User",
    timestamps: true, // Enable timestamps (createdAt and updatedAt)
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
