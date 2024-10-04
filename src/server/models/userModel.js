const mongoose = require("mongoose");

const userModel = new mongoose.Schema(
  {
    //Default (Admin/ToursimGovernor/...)
    username: { type: String, required: true, unique: true },
    email: String,
    password: String,

    //Role
    type: String,

    //Tourist
    nationality: String,
    employed: String,
    wallet: Number,
    DOB: Date,
    age: Number,
    mobile: String,

    //TourGuide
    YearOfExp: Number,
    PrevWork: String,

    //Seller
    description: String,
    fname: String,
    lname: String,

    //Advertiser
    CompanyName: String,
    CompanyLink: String,
    CompanyHotline: Number,

    Status: {
    type: String,
    default: 'Not Accepted',
  }
  },
  {
    collection: "User",
  }
);

const User = mongoose.model("User", userModel);
module.exports = User;
