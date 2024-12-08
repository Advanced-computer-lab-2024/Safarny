const { Router } = require("express");
const router = Router();

const {
  createPost,
  getAllPosts,
  updatePostById,
  getAllPostsBySellerId,
  deletePostsByCreator,
  getRevenueBySeller
} = require("../controllers/postsController.js");
const {
  updateDeleteAccount
} = require("../controllers/usersController.js");

const  sellerController= require("../controllers/sellerController.js");

/*
    1-post product
    2-edit product
    3-get/edit this seller details
    4-get all products
    5-get all products by name
    6-get all products by price
    7-get all products sorted by rating    
*/

router.get("/getTotalRevenueByseller/:id", getRevenueBySeller);
router.get("/filteredRevenueByseller/:id", sellerController.getFilteredRevenueBySeller);

router.post("/createProduct", createPost);

router.get("/products", getAllPosts);

router.get("/products/:sellerid", getAllPostsBySellerId);

router.put("/products/:id", updatePostById);

router.put("/delete_request/:id", updateDeleteAccount);

router.delete("/products/deleteByCreator/:creatorId", deletePostsByCreator);

module.exports = router;
