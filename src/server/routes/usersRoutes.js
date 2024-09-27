import { Router } from "express";
const router = Router();
import { getUsers, deleteUser, getSingleUser, updateUser } from "../controllers/usersController.js";

router.get('/', getUsers);
router.delete('/:id', deleteUser);
router.get('/about', getSingleUser);
router.put('/update', updateUser);
export default router;