const { Router } = require("express");
const { getUsers, deleteUser, getSingleUser, updateUser } = require("../controllers/usersController.js");

const router = Router();

router.get('/', getUsers);
router.delete('/:id', deleteUser);
router.get('/about', getSingleUser);
router.put('/update', updateUser);

module.exports = router;