const express = require('express');
const router = express.Router();
const preferencesController = require('../controllers/preferencesController');

// Route to get tourist preferences by touristId
router.get('/:touristId', preferencesController.getPreferences);

// Route to update tourist preferences by touristId
router.put('/:touristId', preferencesController.updatePreferences);

module.exports = router;
