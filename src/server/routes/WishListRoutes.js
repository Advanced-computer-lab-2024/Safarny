const express = require('express');
const router = express.Router();
const wishListController = require('../controllers/wishListController');

router.post('/add', wishListController.addPostToWishList);
router.post('/remove', wishListController.removePostFromWishList);
router.get('/:userId', wishListController.viewWishList);

module.exports = router;