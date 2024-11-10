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
    currency,
    category,
    tags,
    specialDiscount,
    bookingOpen,
  } = req.body;

  // Basic validation
  if (
    !date ||
    !time ||
    !location ||
    !coordinates ||
    !price ||
    !currency ||
    !category ||
    !req.body.createdby
  ) {
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
      currency,
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
      return res
        .status(404)
        .json({ message: "No activities found for this user." });
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
    currency,
    time,
    category,
    tags,
    specialDiscount,
    archived,
    bookingOpen,
    rating,
    coordinates,
  } = req.body;

  try {
    // Find and update the activity
    const updatedActivity = await Activity.findByIdAndUpdate(
      id,
      {
        date,
        location,
        price,
        archived,
        currency,
        time,
        category,
        tags,
        specialDiscount,
        bookingOpen,
        rating,
        coordinates,
      },
      { new: true } // This option returns the updated document
    );

    // Handle activity not found
    if (!updatedActivity) {
      return res.status(404).json({ message: "Activity not found." });
    }

    // Add the new rating to the ratings array and calculate the new average rating
    if (rating) {
      updatedActivity.rating.push(rating);

      const totalRatings = updatedActivity.rating.length;
      const sumRatings = updatedActivity.rating.reduce((sum, rate) => sum + rate, 0);
      updatedActivity.averageRating = sumRatings / totalRatings;

      await updatedActivity.save();
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

const getActivitiesFiltered = AsyncHandler(async (req, res) => {
  const { minBudget, maxBudget, date, category, rating } = req.query;
  const filter = {};

  // Convert minBudget, maxBudget, and rating to numbers
  const minPrice = minBudget ? Number(minBudget) : 0; // Default minPrice to 0 if not provided
  const maxPrice = maxBudget ? Number(maxBudget) : Infinity; // Default maxPrice to Infinity if not provided
  if (date) filter.date = date;
  if (rating) filter.rating = Number(rating);

  const activities = await Activity.find().populate("category", "type");

  console.log("Filter:", filter);

  // Convert the category query to an array if provided
  const categoriesArray = category ? category.split(",") : [];

  const FilteredActivities = activities.filter((activity) => {
    let match = false; // Tracks if any condition matches

    // Check if price is within the specified range
    if (
      maxBudget &&
      minBudget &&
      activity.price >= minPrice &&
      activity.price <= maxPrice
    ) {
      match = true;
    }

    // Check if date matches
    if (filter.date && activity.date === filter.date) {
      match = true;
    }

    // Check if rating matches
    if (filter.rating && activity.rating === filter.rating) {
      match = true;
    }

    // Check if any category matches from the provided categories array
    if (categoriesArray.length > 0) {
      if (activity.category && activity.category.length > 0) {
        const categoryMatch = activity.category.some((cat) =>
          categoriesArray.includes(cat.type)
        );
        if (categoryMatch) {
          match = true;
        }
      }
    }

    // Return true only if any of the conditions match (price, date, rating, or category)
    return match;
  });

  console.log(
    "Filtered Activities:",
    JSON.stringify(FilteredActivities, null, 2)
  );

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

  const activities = await Activity.find()
    .populate("tags", "name")
    .populate("category", "type")
    .sort(sortCriteria);
  res.json(activities);
});


//updateratingwithid
const updateRating = async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  try {
    const activity = await Activity.findById(id);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found." });
    }

    // Add the new rating to the ratings array
    activity.rating.push(rating);

    // Calculate the new average rating
    const totalRatings = activity.rating.length;
    const sumRatings = activity.rating.reduce((sum, rate) => sum + rate, 0);
    const averageRating = sumRatings / totalRatings;

    // Update the activity with the new average rating
    activity.averageRating = averageRating;
    const updatedActivity = await activity.save();

    res.status(200).json(updatedActivity);
  } catch (error) {
    console.error("Error updating activity:", error);
    res.status(500).json({ message: "Error updating activity." });
  }
};


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
  updateRating
};
