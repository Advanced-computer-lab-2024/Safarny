import { Router } from "express";
const router = Router();
import {getUsers,deleteUser} from "../controllers/usersController.js";

router.get('/',getUsers);
router.delete('/:id',deleteUser);
export default router;