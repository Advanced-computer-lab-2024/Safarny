import express from 'express';
import { createActivity, getActivities, getActivityById, updateActivity, deleteActivity } from '../controllers/activityController.js';

const router = express.Router();

// Activity routes
router.route('/')
    .get(getActivities)
    .post(createActivity);

router.route('/:id')
    .get(getActivityById)
    .put(updateActivity)
    .delete(deleteActivity);

export default router;
