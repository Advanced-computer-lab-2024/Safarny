const { Router } = require("express");
const router = Router();

const {
  createPost,
  getAllPosts,
  updatePostById,
  getAllPostsBySellerId,
} = require("../controllers/postsController.js");

/*
    1-post product
    2-edit product
    3-get/edit this seller details
    4-get all products
    5-get all products by name
    6-get all products by price
    7-get all products sorted by rating    
*/

router.post("/createProduct", createPost);

router.get("/products", getAllPosts);

router.get("/products/:sellerid", getAllPostsBySellerId);

router.put("/products/:id", updatePostById);


module.exports = router;
