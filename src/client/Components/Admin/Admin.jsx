import React, { useState, useEffect } from 'react';
import SideBar from '../SideBar/SideBar';
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
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../../server/config/Firebase';
import { Link, useNavigate , useLocation} from 'react-router-dom';
import styles from './Admin.module.css';
import Logo from '/src/client/Assets/Img/logo.png';
import Footer from '/src/client/Components/Footer/Footer';
import Tags from './tagAdmin';
import ActivityCategory from './ActivityCategory';

const Admin = () => {
  const location = useLocation();
  const { userId } = location.state || {};
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    role: "",
    image: "", // Added image field
  });
  const [userRole, setUserRole] = useState('');

  const [openModal, setOpenModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState({ details: '', price: '', currency: '', quantity: '', imageurl: '' });
  const [editingPostId, setEditingPostId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSection, setSelectedSection] = useState('posts');
  const [currencyCodes, setCurrencyCodes] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  // Search, Filter, and Sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState(''); // Add selectedCurrency state

  //header items
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (selectedSection === 'posts') {
      fetchPosts();
    }
  }, [selectedSection]);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(`.${styles.header}`);
      if (window.scrollY > 50) {
        header.classList.add(styles.translucent);
      } else {
        header.classList.remove(styles.translucent);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const fetchUserRole = async () => {
    try {
      const response = await axios.get(`/tourist/${userId}`);
      const user = response.data;
      setUserRole(user.role);
      console.log('User role:', user.role);
    } catch (err) {
      console.error('Error fetching user role:', err);
    }
  };

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch('https://v6.exchangerate-api.com/v6/033795aceeb35bc666391ed5/latest/EGP');
        const data = await response.json();
        setCurrencyCodes(Object.keys(data.conversion_rates));
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchExchangeRates();
    fetchUserRole();
  }, []);

  const fetchPosts = async () => {
    setLoading(true); // Set loading to true before fetching posts
    try {
      const response = await axios.get('/admin/products');
      setPosts(response.data);
    } catch (error) {
      setErrorMessage('Failed to fetch posts');
    } finally {
      setLoading(false); // Set loading to false after posts are fetched
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

    console.log('Submitting post data:', postData); // Log the postData

    try {
      if (editingPostId) {
        await axios.put(`/admin/products/${editingPostId}`, postData);
      } else {
        await axios.post('/admin/createProduct', postData);
      }
      fetchPosts();
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting post:', error); // Log the error
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

  const handleArchiveChange = async (postId) => {
    try {
      await axios.put(`/admin/products/${postId}`, { archived: true });
      fetchPosts();
    } catch (error) {
      setErrorMessage('Failed to update archive status');
    }
  };

  const handleArchiveToggle = async (postId, isArchived) => {
    try {
      // Update the local state first
      setPosts(posts.map(post =>
          post._id === postId ? { ...post, archived: isArchived } : post
      ));
      console.log("Local state updated");

      // Make a request to the server to update the archived status
      await axios.put(`/admin/products/${postId}`, { archived: isArchived });
      console.log("Archived status updated successfully");

    } catch (error) {
      console.error("Error updating archived status:", error);
      // Optionally, revert the local state if the API call fails
      setPosts(posts.map(post =>
          post._id === postId ? { ...post, archived: !isArchived } : post
      ));
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice =
        (minPrice === '' || post.price >= minPrice) &&
        (maxPrice === '' || post.price <= maxPrice);
    const matchesCurrency = selectedCurrency === '' || post.currency === selectedCurrency;
    return matchesSearch && matchesPrice && matchesCurrency;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return 0;
  });

  return (
      <div className={styles.container}>
        <header className={styles.header}>
          <img src={Logo} alt="Safarny Logo" className={styles.logo} />
          <h1>Safarny</h1>
          <button className={styles.burger} onClick={toggleMenu}>
            <span className={styles.burgerIcon}>&#9776;</span>
          </button>
          <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
            <button onClick={handleBackClick} className={styles.button}>Back</button>
            <Link to="/" className={styles.button}>Homepage</Link>
            <button onClick={handleOpenModal} className={styles.button}>Add Post</button>
            <button onClick={() => setSelectedSection('tags')} className={styles.button}>Manage Tags</button>
            <button onClick={() => setSelectedSection('ActivityCategory')} className={styles.button}>Manage Categories</button>
            <Link to="/adminaddgovernor"  className={styles.button}>Add Governor</Link>
            <Link to="/adminviewcomplaints" className={styles.button}>View Complaints</Link>
          </nav>
        </header>
        <SideBar className={styles.sidebar} />
        <div className={styles.content}>
          <div className={styles.allFilters}>
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
              <div className={styles.minPrice}>
                <TextField
                    label="Min Price"
                    variant="outlined"
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className={styles.priceFilterField}
                />
              </div>
              <div className={styles.maxPrice}>
                <TextField
                    label="Max Price"
                    variant="outlined"
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className={styles.priceFilterField}
                />
              </div>
            </div>

            {/*<FormControl fullWidth margin="normal">*/}
            {/*  <InputLabel>Currency</InputLabel>*/}
            {/*  <Select*/}
            {/*      value={selectedCurrency}*/}
            {/*      onChange={(e) => setSelectedCurrency(e.target.value)}*/}
            {/*  >*/}
            {/*    <MenuItem value="">All</MenuItem>*/}
            {/*    {currencyCodes.map((code) => (*/}
            {/*        <MenuItem key={code} value={code}>{code}</MenuItem>*/}
            {/*    ))}*/}
            {/*  </Select>*/}
            {/*</FormControl>*/}

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

          </div>

          {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
              </div>
          ) : (
              selectedSection === 'posts' && (
                  <div className={styles.cardList}>
                    {sortedPosts.map((post) => (
                        <Card key={post._id} className={styles.card}>
                          <CardContent className={styles.cardContent}>
                            <Typography gutterBottom variant="h5" component="div">
                              {post.details}
                            </Typography>
                            <div>Price: {post.price} {post.currency}</div>
                            <div>Remaining quantity: {post.quantity}</div>
                            <div className={styles.cardImage}>
                              <img src={post.imageurl} alt="Image"/>
                            </div>
                            <label style={{color: 'black'}}>Archive:</label>
                            <div style={{marginTop: '1px'}}>
                              <label style={{color: 'black'}}>
                                <input
                                    type="checkbox"
                                    checked={post.archived}
                                    onChange={(e) => handleArchiveToggle(post._id, e.target.checked)}
                                />
                              </label>
                            </div>
                          </CardContent>
                          <CardActions>
                            <Button
                                size="small"
                                color="primary"
                                variant="contained"
                                style={{ marginRight: '8px' }}
                                onClick={() => handleEditPost(post)}
                            >
                              Edit
                            </Button>
                            <Button
                                size="small"
                                color="error"
                                variant="contained"
                                onClick={() => handleDeletePost(post._id)}
                            >
                              Delete
                            </Button>
                          </CardActions>
                        </Card>
                    ))}
                  </div>
              )
          )}

          {selectedSection === 'tags' && <Tags />}
          {selectedSection === 'ActivityCategory' && <ActivityCategory />}
        </div>

        <Modal open={openModal} onClose={handleCloseModal}>
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <button className={styles.closeButton} onClick={handleCloseModal}>X</button>
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
                  {currencyCodes.map((code) => (
                      <MenuItem key={code} value={code}>{code}</MenuItem>
                  ))}
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
          </div>
        </Modal>

        <Footer />
      </div>
  );
};

export default Admin;