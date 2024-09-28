const { Router } = require("express");
const { getUsers, deleteUser, getSingleUser, updateUser,createProfile ,getProfileById, updateProfileById } = require("../controllers/usersController.js");

const router = Router();

router.get("/", getUsers);
router.delete("/:id", deleteUser);
router.get("/about", getSingleUser);
router.put("/update", updateUser);
// Route for creating a new profile
router.post("/create", createProfile);

// Route for getting a profile by ID
router.get("/:id", getProfileById);

// Route for updating a profile by ID
router.put('/:id', updateProfileById);

module.exports = router;
