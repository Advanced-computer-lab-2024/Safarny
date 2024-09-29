import express from 'express';
const router = express.Router();
import { addGovernor }  from "../controllers/addgovernorController.js";
import { createCategory, getCategories, updateCategory, deleteCategory } from "../controllers/activitycategoryController.js";
router.post('/add-governor', addGovernor);
router.post('/api/categories', createCategory);
router.get('/api/categories', getCategories);
router.put('/api/categories/:id', updateCategory);
router.delete('/api/categories/:id', deleteCategory);

export default router;