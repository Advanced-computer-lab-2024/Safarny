import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, TextField, Typography, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../server/config/Firebase';

const CreatePost = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(true); // Open the modal by default for creating a post
  const [currentPost, setCurrentPost] = useState({ details: '', price: '', currency: '', quantity: '', imageurl: '' });
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

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
      await axios.post('/admin/createProduct', postData); // Assuming the same endpoint for posting
      handleCloseModal();
    } catch (error) {
      setErrorMessage('Failed to add post');
    }
  };

  return (
      <Modal open={openModal} onClose={handleCloseModal}>
        <div style={{ padding: '20px', backgroundColor: 'white', margin: '100px auto', width: '400px' }}>
          <Typography variant="h6">Create New Post</Typography>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
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
          <FormControl fullWidth margin="normal">
            <InputLabel>Currency</InputLabel>
            <Select
                name="currency"
                value={currentPost.currency}
                onChange={handleInputChange}
            >
              <MenuItem value="EGP">EGP</MenuItem>
              <MenuItem value="SAR">SAR</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
              <MenuItem value="GBP">GBP</MenuItem>
            </Select>
          </FormControl>
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
            Add Post
          </Button>
        </div>
      </Modal>
  );
};

export default CreatePost;