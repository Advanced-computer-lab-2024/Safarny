const AsyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const { useRevalidator } = require("react-router-dom");

//Tourist SingUp
const signUp = AsyncHandler(async (req, res) => {
  const { email, username, password, nationality, mobile, DOB, employed } =
    req.body;

  try {
    // Create a new user
    const newUser = new User({
      email,
      username,
      password,
      nationality,
      mobile,
      DOB,
      employed,
      type: "Tourist",
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.LOGIN_EXPIRES_IN,
    });

    // Save user to the database
    await newUser.save();

    res
      .status(201)
      .json({
        token,
        data: { user: newUser },
        message: "User registered successfully",
      });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//Admin-TourGuide-ToursimGoverner-Seller-Advertiser SingUp
const signUpOthers = AsyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // Create a new tour guide
    const newTourGuide = new TourGuide({ email, username, password });

    // Save tour guide to the database
    await newTourGuide.save();

    res.status(201).json({ message: "Tour guide registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const addAdmin = AsyncHandler(async (req, res) => {
  const { email, password, type, username } = req.body;

  try {
    // Create a new user
    const newUser = new User({ email, password, type, username });

    // Save user to the database
    await newUser.save();
    res.status(201).json({ message: "UsAdminer registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = { signUp, signUpOthers, addAdmin };
