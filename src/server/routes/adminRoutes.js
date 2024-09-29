const { Router } = require("express");
const router = Router();
const { addGovernor } = require("../controllers/addgovernorController.js");

router.post("/add-governor", addGovernor);

module.exports = router;
