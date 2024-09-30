const { Router } = require("express");
const router = Router();

const itineraryController = require("../controllers/itineraryController.js");
const usersController = require("../controllers/usersController.js");
const { protect, restrict } = require("../middleware/authMiddleWare.js");

/*
    1-get all this TourGuide Itinerary
    2-get/edit this TourGuide details
    3-CRUD on Itinerary
    4-CRUD on TouristItinerary ??
*/

router
  .route("/get-my-tourguide-details")
  .get(protect, restrict("TourGuide"), usersController.getSingleUser);

router
  .route("/edit-my-tourguide-profile/:id")
  .put(protect, restrict("TourGuide"), usersController.updateProfileById);

router
  .route("/create-itineraries")
  .post(protect, restrict("TourGuide"), itineraryController.createItinerary);

router
  .route("/get-itineraries")
  .get(protect, restrict("TourGuide"), itineraryController.getAllItineraries);

router
  .route("/get-itineraries/:id")
  .get(protect, restrict("TourGuide"), itineraryController.getItineraryById);

router
  .route("/edit-itineraries/:id")
  .put(protect, restrict("TourGuide"), itineraryController.updateItineraryById);

router
  .route("/delete-itineraries/:id")
  .delete(
    protect,
    restrict("TourGuide"),
    itineraryController.deleteItineraryById
  );

router
  .route("/edit-itineraries/:id/tags")
  .patch(
    protect,
    restrict("TourGuide"),
    itineraryController.updateItineraryTagById
  );

module.exports = router;
