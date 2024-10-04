const { User } = require("../models/userModel.js");

const addGovernor = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required" });
  }

  try {
    const newGovernor = await User.create({
      username,
      email,
      password,
      role: "ToursimGoverner",
    });

    return res.status(201).json(newGovernor);
  } catch (err) {
    console.error("Error adding governor:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
module.exports = { addGovernor };
