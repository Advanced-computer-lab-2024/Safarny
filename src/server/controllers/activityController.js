const AsyncHandler = require('express-async-handler');
const Activity = require('../models/Activity.js');

// Create an activity
const createActivity = AsyncHandler(async (req, res) => {
    const { date, time, location, coordinates, price, category, tags, specialDiscount, bookingOpen } = req.body;

    // Basic validation
    if (!date || !time || !location || !coordinates || !price || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const newActivity = new Activity({
            date,
            time,
            location,
            coordinates,
            price,
            category,
            tags,
            specialDiscount,
            bookingOpen
        });

        await newActivity.save();
        res.status(201).json(newActivity);
    } catch (err) {
        console.error('Error creating activity:', err);
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
        res.status(404).json({ message: 'Activity not found' });
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
        activity.specialDiscount = req.body.specialDiscount || activity.specialDiscount;
        activity.bookingOpen = req.body.bookingOpen !== undefined ? req.body.bookingOpen : activity.bookingOpen;

        const updatedActivity = await activity.save();
        res.json(updatedActivity);
    } else {
        res.status(404).json({ message: 'Activity not found' });
    }
});

// Delete an activity
const deleteActivity = AsyncHandler(async (req, res) => {
    const activity = await Activity.findById(req.params.id);

    if (activity) {
        await Activity.findByIdAndDelete(req.params.id); // Use findByIdAndDelete
        res.json({ message: 'Activity removed' });
    } else {
        res.status(404).json({ message: 'Activity not found' });
    }
});

module.exports = { createActivity, getActivities, getActivityById, updateActivity, deleteActivity };
