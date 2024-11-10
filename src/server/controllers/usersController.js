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


const updateWallet = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID" });
        }
        const { wallet } = req.body;
        const updatedDocument = await userModel.findByIdAndUpdate(
        id,
        { wallet },
        { new: true }
        );
        if (!updatedDocument) {
        return res.status(404).json({ message: "Document not found" });
        }
        res.status(200).json(updatedDocument);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating wallet", error });
    }
}

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
      DOB
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
      DOB
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
const updateProfileById = AsyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    console.log("Wallet", req.body.wallet);
    const updateData = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      mobile: req.body.mobile,
      nationality: req.body.nationality,
      employed: req.body.employed,
      wallet: req.body.wallet,
      walletcurrency: req.body.walletcurrency,
      DOB: req.body.DOB,
      age: req.body.age,
      YearOfExp: req.body.YearOfExp,
      PrevWork: req.body.PrevWork,
      itineraries: req.body.itineraries,
      description: req.body.description,
      sellerName: req.body.sellerName,
      posts: req.body.posts,
      CompanyName: req.body.CompanyName,
      CompanyLink: req.body.CompanyLink,
      CompanyHotline: req.body.CompanyHotline,
      activities: req.body.activities,
      historicalPlaces: req.body.historicalPlaces,
      tags: req.body.tags,
      activityCategories: req.body.activityCategories,
      Status: req.body.Status,
    };

    // Remove undefined fields from updateData
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    //console.log("Update Data:", updateData); // Log the update data for debugging

    const user = await userModel.findOneAndUpdate(
        { _id: id },
        updateData,
        { new: true, runValidators: true }
    );

    if (user) {
      console.log("User updated successfully:", user); // Log the updated user for debugging
      res.status(200).json({ message: "Profile updated successfully", user });
    } else {
      console.log("User not found with ID:", id); // Log if user not found
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user:", error); // Log the error for debugging
    res.status(400).json({ error: "An error occurred while updating the user" });
  }
});


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

const updateDeleteAccount = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const { delete_request } = req.body;
    const updatedDocument = await userModel.findByIdAndUpdate(
        id,
        { delete_request },
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

const deleteTourGuideAndIterinaries = async (req, res) => {
  try {
    const userId = req.params.id; // Assume the user ID is provided as a URL parameter

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is an Advertiser (or TourGuide, depending on the role name)
    if (user.role !== "TourGuide") {
      return res.status(400).json({ message: "User is not an TourGuide" });
    }

    // Find itineraries created by this user
    const itineraries = await Itinerary.find({ createdBy: userId });

    // Check if any itinerary has upcoming available times and if there are any bookings
    const now = new Date();
    for (const itinerary of itineraries) {
      // Check if there are upcoming available times
      const hasUpcomingTimes = itinerary.availableTimes.some(time => {
        return new Date(time) > now;
      });

      // Check if there are any bookings (i.e., if the boughtBy array is not empty)
      if (hasUpcomingTimes && (itinerary.boughtBy.length > 0)) {
        return res.status(400).json({
          message: "Cannot delete account: There are upcoming available times or existing bookings",
        });
      }
    }

    // Delete all activities created by this user
    await Itinerary.deleteMany({ createdBy: userId });

    // Delete the user account
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "Advertiser account and all related itineraries deleted successfully" });
  } catch (error) {
    console.error("Error deleting Advertiser account and activities:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteAdvertiserAndActivities = async (req, res) => {
  try {
    const userId = req.params.id; // Assume the user ID is provided as a URL parameter

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is an Advertiser
    if (user.role !== "Advertiser") {
      return res.status(400).json({ message: "User is not an Advertiser" });
    }

    // Find activities created by this Advertiser
    const activities = await Activity.find({ createdby: userId });

    // Check if any activity has an upcoming date and if there are any bookings
    const now = new Date();
    for (const activity of activities) {
      // Check if the activity has an upcoming date
      const activityDate = new Date(activity.date);
      const hasUpcomingDate = activityDate > now;

      // Check if there are any bookings (i.e., if the boughtBy array is not empty)
      if (hasUpcomingDate || (activity.boughtby && activity.boughtby.length > 0)) {
        return res.status(400).json({
          message: "Cannot delete account: There are upcoming activities or existing bookings",
        });
      }
    }

    // Delete all activities created by this Advertiser
    await Activity.deleteMany({ createdby: userId });

    // Delete the user account
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "Advertiser account and all related activities deleted successfully" });
  } catch (error) {
    console.error("Error deleting Advertiser account and activities:", error);
    res.status(500).json({ error: error.message });
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
  updateAcceptedStatus,
    updateWallet,
  updateDeleteAccount,
  deleteTourGuideAndIterinaries,
  deleteAdvertiserAndActivities
};
