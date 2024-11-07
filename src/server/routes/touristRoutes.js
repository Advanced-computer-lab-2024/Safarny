const { Router } = require("express");
const usersController = require("../controllers/usersController.js");
const searchController = require("../controllers/searchController.js");
const flightController=require("../controllers/FlightController.js");
const HotelController=require("../controllers/HotelController.js");

const {
  getAllComplaints,
  updateComplaintById,
  getComplaintsBySubmitterId,
  createComplaint,
} = require("../controllers/userComplaintsController.js");

const {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking,
  cancelBooking,
} = require("../controllers/bookingController.js");

const router = Router();
/*
    1-get/edit this Tourist details
    2-get (musseum, historicalPlace, activty, itinerary) details by (name, category, tag)
    3-get all (musseum, historicalPlace, activty, itinerary)
    4-get all activty by (price, date, category, rating) 
    5-get all (activty, itinerary) sorted by (price, rating) 
    6-get all itinerary by (price, date, tags, language) 
    7-get all historicalPLaces by tags 
    8-get all products
    9-get all products by name
    10-get all products by price
    11-get all products sorted by rating
*/


router.post("/BookedFlights", flightController.createBooking);
router.get("/getBookFlight/:id", flightController.getAllBookingsByid);
router.post("/BookHotel", HotelController.createHotelBooking);
router.get("/getBookHotel/:id", HotelController.getAllBookingsByid);
router.get("/profile", usersController.getSingleUser);

router.delete("/:id", usersController.deleteUser);
router.put("/update", usersController.updateUser);
// Route for creating a new profile
router.post("/create", usersController.createProfile);

router.get("/search", searchController.search);
// Route for getting a profile by ID
router.get("/:id", usersController.getProfileById);



// Route for updating a profile by ID
router.put("/:id", usersController.updateProfileById);

router.get("/complaints", getAllComplaints);
router.put("/complaints/:id", updateComplaintById);
router.get("/complaints/:submitterId", getComplaintsBySubmitterId);
router.post("/complaints", createComplaint);

router.post("/bookings", createBooking);
router.get("/bookings/:touristId", getBookings);
router.put("/bookings/:id", updateBooking);
router.delete("/bookings/:id", deleteBooking);
router.put("/bookings/:id/cancel", cancelBooking);

module.exports = router;
