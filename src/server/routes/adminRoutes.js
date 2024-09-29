const { Router } = require("express");
const router = Router();
const { addGovernor } = require("../controllers/addgovernorController.js");
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/activitycategoryController.js");

router.post("/add-governor", addGovernor);
router.post("/api/categories", createCategory);
router.get("/api/categories", getCategories);
router.put("/api/categories/:id", updateCategory);
router.delete("/api/categories/:id", deleteCategory);

module.exports = router;
