const express = require("express");
const router = express.Router();
const search = require('../controllers/searchController');

// Route to update tourist profile
router.get("/search", searchController.search);


module.exports = router;