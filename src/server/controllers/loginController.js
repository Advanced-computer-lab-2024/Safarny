const User = require("../models/userModel.js");
const AsyncHandler = require("express-async-handler");

const login = AsyncHandler(async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    if (!email) {
      return res.status(400).json({ message: "email does not exists" });
    }

    if (!password) {
      return res.status(400).json({ message: "password does not exists" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email is incorrect" });
    }

    // Check if password matches
    if (password != user.password) {
      return res.status(500).json({ message: "Password is incorrect" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.LOGIN_EXPIRES_IN,
      });
  

    res.status(200).json({
      message: "Sign-in successful",
      id: user._id,
      type: user.type,
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = login;
