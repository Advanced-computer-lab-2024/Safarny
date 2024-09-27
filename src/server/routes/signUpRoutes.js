import { Router } from "express";
const router = Router();
import { signUp, addAdmin, signUpOthers } from "../controllers/signUpController.js";
import {protect} from "../middleware/authMiddleware.js";


router.post('/',signUp);
router.post('/others',signUpOthers);
router.post('/addadmin',addAdmin);

export default router;