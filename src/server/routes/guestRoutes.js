const { Router } = require("express");
const router = Router();

const signUpController = require("../controllers/signUpController.js");
const itineraryController = require("../controllers/itineraryController.js");
const activityController = require("../controllers/activityController.js");
const historicalPlaceController = require("../controllers/historicalplacesController.js");
const login = require("../controllers/loginController.js");
/*
1-post Tourist by (email, username, password, mobile, nationality, DOB, job/student)
2-post (TourGuide, Advertiser, Seller) by (username, email, password)
3-get all (musseum ??, historicalPlace, activty, itinerary)
4-get all activty by (price, date, category, rating) 
5-get all (activty, itinerary) sorted by (price, rating) 
6-get all itinerary by (price, date, tags, language) 
7-get all historicalPLaces by tags`
*/

router.post("/login", login);

router.post("/tourist-signup", signUpController.signUp);
router.post("/others-signup", signUpController.signUpOthers);
router.get("/get-itineraries", itineraryController.getAllItineraries);
router.get("/get-activities", activityController.getActivities);
router.get(
  "/get-historicalPlaces",
  historicalPlaceController.getAllHistoricalPlaces
);

router.get("/filter-activities", activityController.getActivitiesFiltered);
router.get("/get-activities-sorted", activityController.getActivitiesSorted);
router.get("/get-itineraries-sorted", itineraryController.getItinerariesSorted);
router.get("/filter-itineraries", itineraryController.getItinerariesFiltered);
router.get(
  "/filter-historicalPlaces",
  historicalPlaceController.getHistoricalPlacesFiltered
);

router.get("/get-historicalPlaces-sorted",historicalPlaceController.getHistoricalPlacesSorted);
module.exports = router;
