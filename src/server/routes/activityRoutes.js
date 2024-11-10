const express = require("express");
const {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
  addCategoryToActivity,
    updateRating
} = require("../controllers/activityController.js");

const router = express.Router();

// Activity routes
router.route("/").get(getActivities).post(createActivity);

router
  .route("/:id")
  .get(getActivityById)
  .put(updateActivity)
  .delete(deleteActivity);

router.route("/addCategory").post(addCategoryToActivity);
router.get("/:id", getActivityById);
router.put("/updaterating/:id", updateRating);
module.exports = router;
