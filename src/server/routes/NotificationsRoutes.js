const express = require("express");
const { createNotification, updateNotification, getNotifications } = require("../controllers/NotificationsController.js");

const router = express.Router();

// Route to create a new notification
router.post("/create", createNotification);

// Route to update a notification to set read to true
router.put("/update/:notificationId", updateNotification);

router.get("/getNotifications/:userId", getNotifications);

module.exports = router;