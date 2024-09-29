const express = require('express');
const { createActivity, getActivities, getActivityById, updateActivity, deleteActivity } = require('../controllers/activityController.js');

const router = express.Router();

// Activity routes
router.route('/')
    .get(getActivities)
    .post(createActivity);

router.route('/:id')
    .get(getActivityById)
    .put(updateActivity)
    .delete(deleteActivity);

module.exports = router;
