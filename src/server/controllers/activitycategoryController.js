const ActivityCategory = require("../models/ActivityCategory.js");
const User = require("../models/userModel.js");
const mongoose = require("mongoose");

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
  );
  res.status(200).json(updatedCategory);
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  await ActivityCategory.findByIdAndDelete(id);
  res.status(200).json({ message: "Category deleted successfully" });
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
