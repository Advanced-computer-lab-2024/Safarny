import User from "../models/userModel.js";
import AsyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import userModel from "../models/userModel.js";

const getUsers = AsyncHandler(async (req, res) => {
    const { type } = req.query; // Get the user type from query parameters

    if (!type) {
        return res.status(400).json({ message: 'User type is required' });
    }

    try {
        // Find users with the specified type
        const users = await User.find({ type });

        // Return the users found
        return res.status(200).json(users);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

const deleteUser = AsyncHandler(async (req, res) => {
    const userId = req.params.id;

    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

const getSingleUser = AsyncHandler(async (req, res) => {
    const userId = req.query.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

const updateUser = AsyncHandler(async (req, res) => {
    try {
        const { id, username, email, password, mobile} = req.body;
        const user = await userModel.findOneAndUpdate({ id }, { username, email, password, mobile }, { new: true });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ error: 'An error occurred while updating the user' });
    }
});

export { getUsers, deleteUser, getSingleUser };