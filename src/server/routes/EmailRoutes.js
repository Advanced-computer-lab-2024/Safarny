const express = require('express');
const { sendActivityArchivedEmail, sendItineraryArchivedEmail, sendTouristReminderEmail, sendEmail } = require('../controllers/SendEmailController');

const router = express.Router();

router.post('/send-activity-archived-email', sendActivityArchivedEmail);
router.post('/send-itinerary-archived-email', sendItineraryArchivedEmail);
router.post('/send-tourist-reminder-email', sendTouristReminderEmail);
router.post('/send-email', sendEmail);

module.exports = router;