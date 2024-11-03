import React, { useState, useEffect } from 'react';
import SideBar from '../SideBar';
import {
  Button,
  Modal,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  Alert,
  FormControl,
  InputLabel, Select, MenuItem
} from '@mui/material';
import axios from 'axios';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../../server/config/Firebase';
import Tags from './tagAdmin';
import { Link } from 'react-router-dom';
import ActivityCategory from './ActivityCategory';
import styles from './Admin.module.css'; // Import the CSS module


const Admin = () => {
  const [openModal, setOpenModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState({ details: '', price: '', currency: '', quantity: '', imageurl: '' });
  const [editingPostId, setEditingPostId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSection, setSelectedSection] = useState('posts');

  // Search, Filter, and Sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    if (selectedSection === 'posts') {
      fetchPosts();
    }
  }, [selectedSection]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/admin/products');
      setPosts(response.data);
    } catch (error) {
      setErrorMessage('Failed to fetch posts');
    }
  };

  const handleOpenModal = () => {
    setCurrentPost({ details: '', price: '', currency: '', quantity: '', imageurl: '' });
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
        await axios.put(`/admin/products/${editingPostId}`, postData);
      } else {
        await axios.post('/admin/createProduct', postData);
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
      await axios.delete(`/admin/products/${postId}`);
      fetchPosts();
    } catch (error) {
      setErrorMessage('Failed to delete post');
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice =
      (minPrice === '' || post.price >= minPrice) &&
      (maxPrice === '' || post.price <= maxPrice);
    return matchesSearch && matchesPrice;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return 0;
  });

  return (
    <div className={styles.container}>
      <SideBar className={styles.sidebar} />
      <div className={styles.content}>
        <div className={styles.buttonsContainer}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenModal}
            className={styles.button}
          >
            Add Post
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setSelectedSection('tags')}
            className={styles.button}
          >
            Manage Tags
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setSelectedSection('ActivityCategory')}
            className={styles.button}
          >
            Manage Categories
          </Button>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/adminaddgovernor"
            className={styles.button}
          >
            Add Governor
          </Button>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/"
            className={styles.button}
          >
            Home
          </Button>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/adminviewcomplaints"
            className={styles.button}
          >
            View Complaints
          </Button>
        </div>

        {errorMessage && <Alert severity="error" className={styles.errorAlert}>{errorMessage}</Alert>}

        <TextField
          label="Search by Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchField}
        />

        <div className={styles.priceFilterContainer}>
          <TextField
            label="Min Price"
            variant="outlined"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className={styles.priceFilterField}
          />
          <TextField
            label="Max Price"
            variant="outlined"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className={styles.priceFilterField}
          />
        </div>

        <TextField
          label="Sort By Rating"
          select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          SelectProps={{
            native: true,
          }}
          variant="outlined"
          className={styles.sortField}
        >
          <option value="">None</option>
          <option value="rating">Rating</option>
        </TextField>

        {selectedSection === 'posts' && (
          <div className={styles.cardList}>
            {sortedPosts.map((post) => (
              <Card key={post._id} className={styles.card}>
                <CardContent className={styles.cardContent}>
                  <Typography gutterBottom variant="h5" component="div">
                    {post.details}
                  </Typography>
                  <div>Price: {post.price} {post.currency}</div>
                  <div>Quantity: {post.quantity}</div>
                  <div className={styles.cardImage}>
                    <img src={post.imageurl} alt="Image"/>
                  </div>
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
        )}

        {selectedSection === 'tags' && <Tags />}
        {selectedSection === 'ActivityCategory' && <ActivityCategory />}
      </div>

      <Modal open={openModal} onClose={handleCloseModal}>
        <div className={styles.modal}>
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
          <input type="file" onChange={handleImageChange} className={styles.imageInput} />
          <Button variant="contained" color="primary" onClick={handleSubmitPost}>
            {editingPostId ? 'Update Post' : 'Add Post'}
          </Button>
          {errorMessage && <Alert severity="error" className={styles.errorAlert}>{errorMessage}</Alert>}
        </div>
      </Modal>
    </div>
  );
};

export default Admin;
