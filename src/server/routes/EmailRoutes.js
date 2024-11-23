const express = require('express');
const { sendActivityArchivedEmail, sendItineraryArchivedEmail, sendTouristReminderEmail } = require('../controllers/SendEmailController');

const router = express.Router();

router.post('/send-activity-archived-email', sendActivityArchivedEmail);
router.post('/send-itinerary-archived-email', sendItineraryArchivedEmail);
router.post('/send-tourist-reminder-email', sendTouristReminderEmail);

module.exports = router;