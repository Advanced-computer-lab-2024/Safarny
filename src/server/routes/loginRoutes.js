import { Router } from "express";
const router = Router();
import login from "../controllers/loginController.js";


router.post('/', login);

export default router;