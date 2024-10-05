const { Router } = require("express");
const usersController = require("../controllers/usersController.js");
const searchController = require('../controllers/searchController.js');
const router = Router();

router.get("/profile", usersController.getSingleUser);

router.delete("/:id", usersController.deleteUser);
router.put("/update", usersController.updateUser);
// Route for creating a new profile
router.post("/create", usersController.createProfile);

router.get("/search", searchController.search);
// Route for getting a profile by ID
router.get("/:id", usersController.getProfileById);

// Route for updating a profile by ID
router.put('/:id', usersController.updateProfileById);
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

module.exports = router;
