const Notification = require("../models/Notifications.js");
const AsyncHandler = require("express-async-handler");

// Create a new notification
const createNotification = AsyncHandler(async (req, res) => {
  const { title, message, userId } = req.body;
    console.log("title:",title,"message: ", message,"user:", userId);
  if (!title || !message || !userId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newNotification = new Notification({
      title,
      message,
      user: userId,
    });

    const savedNotification = await newNotification.save();
    res.status(201).json(savedNotification);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

const updateNotification = AsyncHandler(async (req, res) => {
    const { notificationId } = req.params;

    try {
        const notification = await Notification.findById(notificationId);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        notification.read = true;
        const updatedNotification = await notification.save();

        res.status(200).json(updatedNotification);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

const getNotifications = AsyncHandler(async (req, res) => {
    const { userId } = req.params;

    try {
        const notifications = await Notification.find({ user: userId });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = { createNotification, updateNotification, getNotifications };