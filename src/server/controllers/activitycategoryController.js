const ActivityCategory = require("../models/ActivityCategory.js");
const User = require("../models/userModel.js");
const mongoose = require("mongoose");
const AsyncHandler = require("express-async-handler");
const Activity = require("../models/Activity");

const createCategory = async (req, res) => {
  const { type } = req.body;
  if (!type) {
    return res.status(400).json({ message: "Type is required." });
  }
  try {
    const newCategory = new ActivityCategory({
      type,
    });
    await newCategory.save();

    return res.status(201).json(newCategory);
  } catch (err) {
    console.error("Error adding category:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getCategories = async (req, res) => {
  const categories = await ActivityCategory.find().populate("activities");
  res.status(200).json(categories);
};

const updateCategory = async (req, res) => {
  const { id } = req.params; //must have the category id
  const { type } = req.body;

  const updatedCategory = await ActivityCategory.findByIdAndUpdate(
    id,
    { type },
    { new: true }
  );
  res.status(200).json(updatedCategory);
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  await ActivityCategory.findByIdAndDelete(id);
  res.status(200).json({ message: "Category deleted successfully" });
};

const getActivityCategoryById = async (req, res) => {
  const { id } = req.params;
  activityCategory = ActivityCategory.findById(id);

  if (activityCategory) {
    res.json(activityCategory);
  } else {
    res.status(404).json({ message: "Activity category not found" });
  }
};
module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getActivityCategoryById,
};
