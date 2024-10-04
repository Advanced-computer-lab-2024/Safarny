const { Router } = require("express");
const router = Router();
const { addGovernor } = require("../controllers/addgovernorController.js");
/*
    1-post toursimGoverner
    2-delete user
    3-post admin
    4-CRUD on activityCategory
    5-CRUD on tags
    6-post product
    7-edit product 
    8-get all products
    9-get all products by name
    10-get all products by price
    11-get all products sorted by rating
*/
router.post("/add-governor", addGovernor);

module.exports = router;
