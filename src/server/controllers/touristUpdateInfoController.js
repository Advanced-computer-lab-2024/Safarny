import mongoose from 'mongoose';
import User from '../models/userModel.js';

const updateTouristProfileById = async (req, res) => {
  // Extract the ID from the URL and remove any leading colon
  const id = req.params.id.replace(/^:/, '');
  const updates = req.body;

  // Validate the ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const tourist = await User.findById(id);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Check if the user is trying to update 'Username' or 'WALLET'
    if (updates.username || updates.wallet) {
      return res.status(400).json({
        error: "Cannot update Username or WALLET"
      });
    }

    // If any other fields are being updated, proceed with the update
    const allowedUpdates = {
      email: updates.email || tourist.email,
      password: updates.password || tourist.password,
      nationality: updates.nationality || tourist.nationality,
      mobile: updates.mobile || tourist.mobile,
      employed: updates.employed || tourist.employed,
      type: updates.type || tourist.type,
      age: updates.age || tourist.age,
      YearOfExp: updates.YearOfExp || tourist.YearOfExp,
      PrevWork: updates.PrevWork || tourist.PrevWork
    };

    const updatedTourist = await User.findByIdAndUpdate(
      id,
      allowedUpdates,
      { new: true }
    );

    res.status(200).json({ message: "Profile updated successfully", updatedTourist });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default updateTouristProfileById;