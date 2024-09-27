import { Router } from "express";
const router = Router();
import { getUsers, deleteUser, getSingleUser, updateUser,createProfile ,getProfileById, updateProfileById } from "../controllers/usersController.js"; 


router.get('/',getUsers);
router.delete('/:id',deleteUser);
router.get('/about',getSingleUser);
router.put('/update',updateUser);
// Route for creating a new profile
router.post('/create', createProfile);

// Route for getting a profile by ID
router.get('/:id', getProfileById);

// Route for updating a profile by ID
router.put('/:id', updateProfileById);
export default router;