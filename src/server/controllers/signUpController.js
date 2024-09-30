const AsyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");

const signUp = AsyncHandler(async (req, res) => {
  const { email, username, password, nationality, mobile, employed, type } =
    req.body;

  try {
    // Create a new user
    const newUser = new User({
      email,
      username,
      password,
      nationality,
      mobile,
      employed,
      type,
    });

    // Save user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const signUpOthers = AsyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    try {
        // Create a new tour guide
        const newTourGuide = new TourGuide({ email, username, password });

        // Save tour guide to the database
        await newTourGuide.save();

        res.status(201).json({ message: 'Tour guide registered successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


const addAdmin = AsyncHandler(async (req, res) => {
  const { email, password, type, username } = req.body;

  try {
    // Create a new user
    const newUser = new User({ email, password, type, username });
    await newUser.save();
    res.status(201).json({ message: "UsAdminer registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = { signUp, signUpOthers,addAdmin };
