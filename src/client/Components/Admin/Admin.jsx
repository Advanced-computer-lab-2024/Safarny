import React, { useState, useEffect } from 'react';
import SideBar from '../SideBar';
import { Button, Modal, TextField, Typography, Card, CardContent, CardActions, Alert } from '@mui/material';
import axios from 'axios';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../../server/config/Firebase';

const Admin = () => {
  const [openModal, setOpenModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState({ details: '', price: '', quantity: '', imageurl: '' });
  const [editingPostId, setEditingPostId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/posting/posts');
      setPosts(response.data);
    } catch (error) {
      setErrorMessage('Failed to fetch posts');
    }
  };

  const handleOpenModal = () => {
    setCurrentPost({ details: '', price: '', quantity: '', imageurl: '' });
    setEditingPostId(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setErrorMessage('');
    setSelectedImage(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPost({ ...currentPost, [name]: value });
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const uploadImage = async (file) => {
    if (!file) return null;

    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleSubmitPost = async () => {
    let imageUrl = currentPost.imageurl;

    if (selectedImage) {
      imageUrl = await uploadImage(selectedImage);
      if (!imageUrl) return;
    }

    const postData = { ...currentPost, imageurl: imageUrl };

    try {
      if (editingPostId) {
        await axios.put(`/posting/posts/${editingPostId}`, postData);
      } else {
        await axios.post('/posting/posts', postData);
      }
      fetchPosts();
      handleCloseModal();
    } catch (error) {
      setErrorMessage(`Failed to ${editingPostId ? 'update' : 'add'} post`);
    }
  };

  const handleEditPost = (post) => {
    setCurrentPost(post);
    setEditingPostId(post._id);
    setOpenModal(true);
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`/posting/posts/${postId}`);
      fetchPosts();
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
            <Card key={post._id} sx={{ maxWidth: 345, margin: '10px', backgroundColor: 'white' }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {post.details}
                </Typography>
                <div>Price: {post.price}</div>
                <div>Quantity: {post.quantity}</div>
                <img src={post.imageurl} alt="Post" style={{ width: '100%', height: 'auto' }} />
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
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ margin: '10px 0' }}
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
