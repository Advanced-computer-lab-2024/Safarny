const { Router } = require("express");
const router = Router();

const {
    createActivity,
    getActivities,
    getActivityById,
    updateActivity,
    deleteActivity,
    addCategoryToActivity,
    getActivitiesByUserId,
  } = require("../controllers/activityController.js");
  
  const {
    getCategories,
  } = require("../controllers/activitycategoryController.js");
  
  
  
  ;
  /*
    1-get/edit this Advertiser details
    2-CRUD on Activity
    3-get all this Advertiser Activity
*/
  
  // Activity routes
  router.get("/GetCategories", getCategories);
  router.route("/").get(getActivities).post(createActivity);
  router.get("/activities/user/:userId", getActivitiesByUserId); // Route for getting activities by user ID

  router
    .route("/:id")
    .get(getActivityById)
    .put(updateActivity)
    .delete(deleteActivity);
  
  router.route("/addCategory").post(addCategoryToActivity);

module.exports = router;
