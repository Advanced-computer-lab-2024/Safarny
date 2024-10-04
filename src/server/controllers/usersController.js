const User = require("../models/userModel.js");
const AsyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const userModel = require("../models/userModel.js");

const getAllUsers = AsyncHandler(async (req, res) => {
  try {
    // Find all users
    const users = await User.find();

    // Return the users found
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

const getUsers = AsyncHandler(async (req, res) => {
  const { role } = req.query; // Get the user type from query parameters

  if (!role) {
    return res.status(400).json({ message: "User role is required" });
  }

  try {
    // Find users with the specified type
    const users = await User.find({ role });

    // Return the users found
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

const deleteUser = AsyncHandler(async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const getSingleUser = AsyncHandler(async (req, res) => {
  const userId = req.query.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const updateUser = AsyncHandler(async (req, res) => {
  try {
    const { id, username, email, password, mobile } = req.body;
    const user = await userModel.findOneAndUpdate(
      { id },
      { username, email, password, mobile },
      { new: true }
    );
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res
      .status(400)
      .json({ error: "An error occurred while updating the user" });
  }
});

// Controller for creating a new profile
const createProfile = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      nationality,
      mobile,
      employed,
      role,
      YearOfExp,
      PrevWork,
    } = req.body;

    // Create a new Profile
    const newProfile = new User({
      username,
      email,
      password,
      nationality,
      mobile,
      employed,
      role,
      YearOfExp,
      PrevWork,
    });

    // Save the new profile to the database
    const savedProfile = await newProfile.save();

    res.status(201).json({
      message: "Profile created successfully",
      profile: savedProfile,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controller for reading (getting) a profile by ID
const getProfileById = async (req, res) => {
  try {
    const profileId = req.params.id;

    // Find the profile by its ID
    const profile = await User.findById(profileId);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controller for updating a profile by ID
const updateProfileById = async (req, res) => {
  try {
    const profileId = req.params.id;
    const {
      username,
      email,
      password,
      nationality,
      mobile,
      employed,
      role,
      YearOfExp,
      PrevWork,
    } = req.body;

    // Find the profile by its ID and update it with the new data
    const updatedProfile = await User.findByIdAndUpdate(
      profileId,
      {
        username,
        email,
        password,
        nationality,
        mobile,
        employed,
        role,
        YearOfExp,
        PrevWork,
      },
      { new: true, runValidators: true } // Return the updated profile
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

};

const updateAcceptedStatus = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const { Status } = req.body; 
    const updatedDocument = await userModel.findByIdAndUpdate(
      id,
      { Status }, 
      { new: true }           
    );
    if (!updatedDocument) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json(updatedDocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating Accepted status", error });
  }
};




module.exports = {
  getUsers,
  deleteUser,
  getSingleUser,
  updateUser,
  createProfile,
  getProfileById,
  updateProfileById,
  getAllUsers, // Export the new function
  updateAcceptedStatus
};
