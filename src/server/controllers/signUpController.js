const AsyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const TourGuideController = require("./tourGuideController.js");
const SellerController = require("./sellerController.js");
const AdvertiserController = require("./advertiserController.js");

//Tourist SingUp
const signUp = AsyncHandler(async (req, res) => {
  const { email, username, password, nationality, walletcurrency, mobile, DOB, employed } =
    req.body;

  try {
    // Create a new user
    const newUser = new User({
      email,
      username,
      password,
      nationality,
      walletcurrency,
      mobile,
      DOB,
      employed,
      role: "Tourist",
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.LOGIN_EXPIRES_IN,
    });

    // Save user to the database
    await newUser.save();

    res.status(201).json({
      token,
      data: { user: newUser },
      message: "Tourist registered successfully",
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//Admin-TourGuide-ToursimGoverner-Seller-Advertiser SingUp
const signUpOthers = AsyncHandler(async (req, res) => {
  try {
    switch (req.body.role) {
      case "TourGuide":
        await TourGuideController.createTourGuide(req, res);
        return;
      case "Advertiser":
        await AdvertiserController.createAdvertiser(req, res);
        return;
      case "Seller":
        await SellerController.createSeller(req, res);
        return;
      default:
        res.status(400).json({ error: "Invalid role" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const addAdmin = AsyncHandler(async (req, res) => {
  const { email, password, type, username } = req.body;

  try {
    // Create a new user
    const newUser = new User({
      email,
      password,
      username,
      role: "Admin",
    });

    // Save user to the database
    await newUser.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = { signUp, signUpOthers, addAdmin };
