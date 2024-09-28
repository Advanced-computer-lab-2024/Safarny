const express = require("express");
const router = express.Router();
const {
  signUp,
  addAdmin,
  signUpOthers,
} = require("../controllers/signUpController.js");
const { protect } = require("../middleware/authMiddleware.js");

router.post("/", signUp);
router.post("/others", signUpOthers);
router.post("/addadmin", addAdmin);

module.exports = router;
