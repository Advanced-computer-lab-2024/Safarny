import ActivityCategory from "../models/ActivityCategory.js"; // Ensure this import is correct
import AsyncHandler from 'express-async-handler';
import User from "../models/userModel.js";
const createCategory = AsyncHandler (async  (req, res) => {
    const { type } = req.body;
    if (!type) {
        return res.status(400).json({ message: 'Type is required.' });
    }
    try {
        // Create the new tourism governor
        const newCategory = await User.create({
            type,
        });

        // Return the created governor user
        return res.status(201).json(newCategory);
    } catch (err) {
        console.error('Error adding category:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

const getCategories = async (req, res) => {
    const categories = await ActivityCategory.find();
    res.status(200).json(categories);
};

const updateCategory = async (req, res) => {
    const { id } = req.params; //must have the category id
    const { type } = req.body;

    const updatedCategory = await ActivityCategory.findByIdAndUpdate(
        id,
        { type },
        { new: true }
    )
    res.status(200).json(updatedCategory);
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    await ActivityCategory.findByIdAndDelete(id);
    res.status(200).json({ message: "Category deleted successfully" });
};

export { createCategory, getCategories, updateCategory, deleteCategory };
