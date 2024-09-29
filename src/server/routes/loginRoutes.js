const { Router } = require("express");
const router = Router();
const login = require("../controllers/loginController.js");

router.post('/', login);

module.exports = router;
