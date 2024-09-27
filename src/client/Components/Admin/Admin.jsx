import React, { useState, useEffect } from 'react';
import SideBar from '../SideBar';
import { Button, Modal, TextField, Typography, Card, CardContent, CardActions, Alert } from '@mui/material';
import axios from 'axios';

const Admin = () => {
  // States
  const [openModal, setOpenModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState({ details: '', price: '', quantity: '', imageurl: '' });
  const [editingPostId, setEditingPostId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch all posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Fetch all posts from the API
  const fetchPosts = async () => {
    try {
      const response = await axios.get('/posting/posts');
      setPosts(response.data);
    } catch (error) {
      setErrorMessage('Failed to fetch posts');
    }
  };

  // Handle modal open
  const handleOpenModal = () => {
    setCurrentPost({ details: '', price: '', quantity: '', imageurl: '' });
    setEditingPostId(null); // Reset editing post ID
    setOpenModal(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setOpenModal(false);
    setErrorMessage('');
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPost({ ...currentPost, [name]: value });
  };

  // Handle post submission (Create or Update)
  const handleSubmitPost = async () => {
    if (editingPostId) {
      // Edit existing post
      try {
        await axios.put(`/posting/posts/${editingPostId}`, currentPost);
        fetchPosts();
        handleCloseModal();
      } catch (error) {
        setErrorMessage('Failed to update post');
      }
    } else {
      // Add new post
      try {
        await axios.post('/posting/posts', currentPost);
        fetchPosts();
        handleCloseModal();
      } catch (error) {
        setErrorMessage('Failed to add post');
      }
    }
  };

  // Handle post edit (opens modal)
  const handleEditPost = (post) => {
    setCurrentPost(post);
    setEditingPostId(post._id);
    setOpenModal(true);
  };

  // Handle post delete
  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`/posting/posts/${postId}`);
      fetchPosts(); // Refresh posts after deletion
    } catch (error) {
      setErrorMessage('Failed to delete post');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <SideBar />
      <div style={{ marginLeft: '250px', padding: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Add Post
        </Button>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        {/* Display all posts */}
        <div style={{ marginTop: '20px' }}>
          {posts.map((post) => (
            <Card key={post._id} sx={{ maxWidth: 345, margin: '10px', backgroundColor: 'white', }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {post.details}
                </Typography>
                <div>Price : {post.price}</div>
                <div>Quantity : {post.quantity}</div>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => handleEditPost(post)}>
                  Edit
                </Button>
                <Button size="small" color="secondary" onClick={() => handleDeletePost(post._id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal for Adding/Editing Post */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <div style={{ padding: '20px', backgroundColor: 'white', margin: '100px auto', width: '400px' }}>
          <Typography variant="h6">{editingPostId ? 'Edit Post' : 'Add New Post'}</Typography>
          <TextField
            fullWidth
            label="Details"
            name="details"
            value={currentPost.details}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Price"
            name="price"
            type="number"
            value={currentPost.price}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Quantity"
            name="quantity"
            type="number"
            value={currentPost.quantity}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Image URL"
            name="imageurl"
            value={currentPost.imageurl}
            onChange={handleInputChange}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitPost}
            style={{ marginTop: '20px' }}
          >
            {editingPostId ? 'Update Post' : 'Add Post'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Admin;
