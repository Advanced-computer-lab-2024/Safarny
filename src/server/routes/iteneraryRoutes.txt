import { Router } from "express";
const router = Router();

import {getIteneraries,deleteItenerary, updateItenerary} from "../controllers/iteneraryController.js";
import {createItenerary} from "../controllers/iteneraryController.js";

router.get('/',getIteneraries);
router.delete('/:id',deleteItenerary);
router.put('/update',updateItenerary);
router.post('/',createItenerary)


export default router;