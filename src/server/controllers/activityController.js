const AsyncHandler = require("express-async-handler");
const Activity = require("../models/Activity.js");
const ActivityCategory = require("../models/ActivityCategory.js");
const Tag = require("../models/Tags.js");

// Create an activity
const createActivity = AsyncHandler(async (req, res) => {
    const {
      date,
      time,
      location,
      coordinates,
      price,
      category,
      tags,
      specialDiscount,
      bookingOpen,
    } = req.body;
  
    // Basic validation
    if (!date || !time || !location || !coordinates || !price || !category || !req.body.createdby) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    try {
      let tagIds = [];
  
      // Iterate over each tag name in the request
      for (let tagName of tags) {
        let tag = await Tag.findOne({ name: tagName });
  
        if (!tag) {
          return res.status(400).send({ error: `Tag ${tagName} does not exist` });
        }
        tagIds.push(tag._id);
      }
  
      const newActivity = new Activity({
        date,
        time,
        location,
        coordinates,
        price,
        category,
        tags: tagIds,
        specialDiscount,
        bookingOpen,
        createdby: req.body.createdby, // Include userId
      });
  
      await newActivity.save();
      res.status(201).json(newActivity);
    } catch (err) {
      console.error("Error creating activity:", err);
      res.status(400).json({ error: err.message });
    }
  });
 // Get activities by user ID
 const getActivitiesByUserId = async (req, res) => {
    const { userId } = req.params;
    
    try {
        const activities = await Activity.find({ createdby: userId }); // Ensure 'createdby' matches your model
        if (!activities || activities.length === 0) {
            return res.status(404).json({ message: "No activities found for this user." });
        }
        res.status(200).json(activities);
    } catch (error) {
        console.error("Error fetching activities:", error);
        res.status(500).json({ message: "Error fetching activities." });
    }
};

// Get all activities
const getActivities = AsyncHandler(async (req, res) => {
  const activities = await Activity.find();
  res.json(activities);
});

// Get a single activity
const getActivityById = AsyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id);
  if (activity) {
    res.json(activity);
  } else {
    res.status(404).json({ message: "Activity not found" });
  }
});

// Update an activity
const updateActivity = async (req, res) => {
    const { id } = req.params;
    const {
        date,
        location,
        price,
        time,
        category, // Change to singular if your model has a single category
        tags,
        specialDiscount,
        bookingOpen
    } = req.body; // Adjust according to your model

    try {
        // Find and update the activity
        const updatedActivity = await Activity.findByIdAndUpdate(
            id,
            {
                date,
                location,
                price,
                time,
                category, // Ensure you update the singular field correctly
                tags,
                specialDiscount,
                bookingOpen,
            },
            { new: true } // This option returns the updated document
        );

        // Handle activity not found
        if (!updatedActivity) {
            return res.status(404).json({ message: "Activity not found." });
        }

        // Success
        res.status(200).json(updatedActivity);
    } catch (error) {
        console.error("Error updating activity:", error);
        res.status(500).json({ message: "Error updating activity." });
    }
};


// Delete an activity
const deleteActivity = AsyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id);

  if (activity) {
    await Activity.findByIdAndDelete(req.params.id); // Use findByIdAndDelete
    res.json({ message: "Activity removed" });
  } else {
    res.status(404).json({ message: "Activity not found" });
  }
});

// Add a category to an activity
const addCategoryToActivity = AsyncHandler(async (req, res) => {
  const { activityId, categoryId } = req.body;

  const activity = await Activity.findById(activityId);
  const category = await ActivityCategory.findById(categoryId);

  if (activity && category) {
    activity.activityCategory.push(categoryId);
    await activity.save();
    res.json(activity);
  } else {
    res.status(404).json({ message: "Activity or Category not found" });
  }
});

// Get filtered activities
const getActivitiesFiltered = AsyncHandler(async (req, res) => {
  const { price, date, category, rating } = req.query;
  const filter = {};

  if (price) filter.price = price;
  if (date) filter.date = date;
  if (category) filter.category = category;
  if (rating) filter.rating = rating;

  const activities = await Activity.find().populate("activityCategory");

  const FilteredActivities = activities.filter((activity) => {
    for (let key in filter) {
      if (activity[key] !== filter[key]) {
        return false;
      }
    }
    return true;
  });
  res.json(FilteredActivities);
  
});

// Get sorted activities
const getActivitiesSorted = AsyncHandler(async (req, res) => {
  const { sortBy } = req.query;
  const sortCriteria = {};

  if (sortBy) {
    const [field, order] = sortBy.split(":");
    sortCriteria[field] = order === "desc" ? -1 : 1;
  }

  const activities = await Activity.find().populate("tags","name").populate("category","type").sort(sortCriteria);
  res.json(activities);
});

module.exports = {
    createActivity,
    getActivities,
    getActivityById,
    updateActivity,
    deleteActivity,
    addCategoryToActivity,
    getActivitiesFiltered,
    getActivitiesSorted,
    getActivitiesByUserId, // Add this line
  };
