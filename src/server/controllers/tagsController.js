const Tags = require("../models/Tags");

// Create a new tag
const createTag = async (req, res) => {
  try {
    const newTag = new Tags(req.body);
    const savedTag = await newTag.save();
    res.status(201).json(savedTag);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all tags
const getAllTags = async (req, res) => {
  try {
    const tags = await Tags.find();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all tags by name
const getAllTagsFilter = async (req, res) => {
  try {
    const tags = await Tags.find({ name: req.params.name });
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get a single tag by ID
const getTagById = async (req, res) => {
  try {
    const tag = await Tags.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a tag by ID
const updateTagById = async (req, res) => {
  try {
    const updatedTag = await Tags.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedTag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.status(200).json(updatedTag);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a tag by ID
const deleteTagById = async (req, res) => {
  try {
    const deletedTag = await Tags.findByIdAndDelete(req.params.id);
    if (!deletedTag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTag,
  getAllTags,
  getAllTagsFilter,
  getTagById,
  updateTagById,
  deleteTagById,
};
