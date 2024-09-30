const AsyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");

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
  const { email, username, password, role } = req.body;

  try {
    const newUser = new User({ email, username, password, role });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.LOGIN_EXPIRES_IN,
    });

    await newUser.save();

    res.status(201).json({
      token,
      data: { user: newUser },
      message: `user with role ${role} registered successfully`,
    });
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
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = { signUp, signUpOthers, addAdmin };
