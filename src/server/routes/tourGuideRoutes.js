const { Router } = require("express");
const router = Router();

const itineraryController = require("../controllers/itineraryController.js");
const usersController = require("../controllers/usersController.js");
const activityController = require("../controllers/activityController.js");
const tagsController = require("../controllers/tagsController.js");
const { protect, restrict } = require("../middleware/authMiddleWare.js");
//const tourGuide = require("../models/TourGuide");
const tourGuideController = require("../controllers/tourGuideController.js");

/*
    1-get all this TourGuide Itinerary
    2-get/edit this TourGuide details
    3-CRUD on Itinerary
*/
router.route("/getItineraryClients/:id").get(tourGuideController.getBoughtCountByTourGuide);
router.route("/getItineraryRevenueByTourGuide/:id").get(tourGuideController.getItineraryRevenueByTourGuide);

router.route("/get-my-tourguide-itineraries/:tourguideId").get(itineraryController.geItinerariesFor);

router.route("/get-my-tourguide-details").get(usersController.getSingleUser);

router.route("/get-activities").get(activityController.getActivities);

router.route("/get-tags").get(tagsController.getAllTags);

router
  .route("/edit-my-tourguide-profile/:id")
  .put(usersController.updateProfileById);

router.route("/create-itineraries").post(itineraryController.createItinerary);

router.route("/get-itineraries").get(itineraryController.getAllItineraries);

router.route("/get-itineraries/:id").get(itineraryController.getItineraryById);

router
  .route("/edit-itineraries/:id")
  .put(itineraryController.updateItineraryById);

router
  .route("/delete-itineraries/:id")
  .delete(itineraryController.deleteItineraryById);

router
  .route("/edit-itineraries-tag/:id/tags")
  .patch(itineraryController.updateItineraryTagById);

router.route("/delete_request/:id").put(usersController.updateDeleteAccount);

router.put("/updaterating", tourGuideController.updateAverageRatingById);
router.route("/getClientsByItinerary/:id").get(itineraryController.getBoughtCountByItinerary);
router.route("/report/:id").get(itineraryController.getTouristsByItineraryAndDate);
module.exports = router;
