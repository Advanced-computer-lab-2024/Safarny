const mongoose = require('mongoose');
const Posts = require('./Posts');

const wishListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posts'
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'WishList'
  }
);

const WishList = mongoose.model('WishList', wishListSchema);
module.exports = WishList;