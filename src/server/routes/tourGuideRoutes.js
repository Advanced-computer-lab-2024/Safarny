const { Router } = require("express");
const router = Router();

const itineraryController = require("../controllers/itineraryController.js");
const usersController = require("../controllers/usersController.js");
const { protect, restrict } = require("../middleware/authMiddleWare.js");

/*
    1-get all this TourGuide Itinerary
    2-get/edit this TourGuide details
    3-CRUD on Itinerary
*/

router.route("/get-my-tourguide-details").get(usersController.getSingleUser);

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
  .route("/edit-itineraries/:id/tags")
  .patch(itineraryController.updateItineraryTagById);

module.exports = router;
