const WishList = require('../models/WishList');
const Posts = require('../models/Posts'); // Updated to use Post model

// Add a post to the wishlist
exports.addPostToWishList = async (req, res) => {
  const { userId, postId } = req.body;

  if (!postId) {
    return res.status(400).json({ error: 'Post ID is required' });
  }

  try {
    let wishList = await WishList.findOne({ user: userId });

    if (!wishList) {
      wishList = new WishList({ user: userId, items: [] });
    }

    if (!wishList.items.includes(postId)) {
      wishList.items.push(postId);
      await wishList.save();
    }

    console.log('Updated wishlist:', wishList); // Log the updated wishlist
    res.status(200).json(wishList);
  } catch (error) {
    console.error('Error adding post to wishlist:', error); // Log the error
    res.status(500).json({ error: error.message });
  }
};

// Remove a post from the wishlist
exports.removePostFromWishList = async (req, res) => {
  const { userId, postId } = req.body;

  try {
    const wishList = await WishList.findOne({ user: userId });

    if (wishList) {
      wishList.items = wishList.items.filter(item => item.toString() !== postId);
      await wishList.save();
    }

    res.status(200).json(wishList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// View the wishlist
exports.viewWishList = async (req, res) => {
  const { userId } = req.params;

  try {
    const wishList = await WishList.findOne({ user: userId }).populate('items');

    if (!wishList) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    res.status(200).json(wishList);
  } catch (error) {
    console.log('Error fetching wishlist:', error);
    res.status(500).json({ error: error.message });
  }
};