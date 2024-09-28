import express from 'express';
const router = express.Router();
import { addGovernor }  from "../controllers/addgovernorController.js";

router.post('/add-governor', addGovernor);
export default router;