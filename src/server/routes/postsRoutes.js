import express from 'express';
import {
  createPost,
  getAllPosts,
  updatePostById,
  deletePostById
} from '../controllers/postsController.js'; 
const router = express.Router();

// Route for creating a post (product)
router.post('/posts', createPost);

// Route for getting all posts (products)
router.get('/posts', getAllPosts);

// Route for updating a post (product) by ID
router.put('/posts/:id', updatePostById);

// Route for deleting a post (product) by ID
router.delete('/posts/:id', deletePostById);

export default router;
