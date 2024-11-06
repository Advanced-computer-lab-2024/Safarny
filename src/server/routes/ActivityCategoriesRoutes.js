const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getActivityCategoryById,
} = require("../controllers/activitycategoryController.js");

router.post("/", createCategory);
router.get("/", getCategories);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);
//router.get("/category/:id", getActivityCategoryById);
module.exports = router;
