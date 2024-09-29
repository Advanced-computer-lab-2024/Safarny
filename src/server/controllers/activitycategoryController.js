import ActivityCategory from "../models/ActivityCategory.js"; // Ensure this import is correct
import AsyncHandler from 'express-async-handler';
import User from "../models/userModel.js";  // Ensure this import is here
const Category = require("../models/ActivityCategory.js");
const mongoose = require("mongoose");

const createCategory = async (req, res) => {
    const { type } = req.body;
    const newCategory = new Category({ type });
    await newCategory.save();
    res.status(201).json(newCategory);
};

const getCategories = async (req, res) => {
    const categories = await Category.find();
    res.status(200).json(categories);
};

const updateCategory = async (req, res) => {
    const { id } = req.params; //must have the category id
    const { type } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { type },
        { new: true }
    )
    res.status(200).json(updatedCategory);
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: "Category deleted successfully" });
};

module.exports = { createCategory, getCategories, updateCategory, deleteCategory };
