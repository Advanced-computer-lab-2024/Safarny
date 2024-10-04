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
    tagNames,
    specialDiscount,
    bookingOpen,
  } = req.body;

  // Basic validation
  if (!date || !time || !location || !coordinates || !price || !category) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let tagIds = [];

    // Iterate over each tag name in the request
    for (let tagName of tagNames) {
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
    });

    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (err) {
    console.error("Error creating activity:", err);
    res.status(400).json({ error: err.message });
  }
});

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
const updateActivity = AsyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id);

  if (activity) {
    activity.date = req.body.date || activity.date;
    activity.time = req.body.time || activity.time;
    activity.location = req.body.location || activity.location;
    activity.coordinates = req.body.coordinates || activity.coordinates;
    activity.price = req.body.price || activity.price;
    activity.category = req.body.category || activity.category;
    activity.tags = req.body.tags || activity.tags;
    activity.specialDiscount =
      req.body.specialDiscount || activity.specialDiscount;
    activity.bookingOpen =
      req.body.bookingOpen !== undefined
        ? req.body.bookingOpen
        : activity.bookingOpen;

    const updatedActivity = await activity.save();
    res.json(updatedActivity);
  } else {
    res.status(404).json({ message: "Activity not found" });
  }
});

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

  const activities = await Activity.find(filter);
  res.json(activities);
});

// Get sorted activities
const getActivitiesSorted = AsyncHandler(async (req, res) => {
  const { sortBy } = req.query;
  const sortCriteria = {};

  if (sortBy) {
    const [field, order] = sortBy.split(":");
    sortCriteria[field] = order === "desc" ? -1 : 1;
  }

  const activities = await Activity.find().sort(sortCriteria);
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
};
