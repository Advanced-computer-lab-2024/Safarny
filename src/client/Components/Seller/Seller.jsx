import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  Alert, InputLabel, Select, MenuItem, FormControl,
} from "@mui/material";
import axios from "axios";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "/src/server/config/Firebase";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "/src/client/Components/Footer/Footer";
import Header from "/src/client/Components/Header/Header";
import styles from './Seller.module.css';
import { Rating } from "@mui/material";

const Seller = () => {
  const [openModal, setOpenModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState({
    details: "",
    price: "",
    quantity: "",
    imageurl: "",
  });
  const [editingPostId, setEditingPostId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSection, setSelectedSection] = useState("posts");
  const [currencyCodes, setCurrencyCodes] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");

  const location = useLocation();
  const { userId } = location.state;
  const sellerId = userId;
  useEffect(() => {
    if (selectedSection === "posts") {
      fetchPosts();
    }
  }, [selectedSection]);
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_EXCHANGE_API_URL);

        setCurrencyCodes(Object.keys(response.data.conversion_rates));
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchExchangeRates();
  }, []);
  const fetchPosts = async () => {
    try {
      const response = await axios.get(`/seller/products/${sellerId}`);
      setPosts(response.data);
      console.log(sellerId);
    } catch (error) {
      setErrorMessage("Failed to fetch posts");
    }
  };

  const handleOpenModal = () => {
    setCurrentPost({ details: "", price: "", currency: "", quantity: "", imageurl: "" });
    setEditingPostId(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setErrorMessage("");
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
            const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
    if (!currentPost.details || !currentPost.price || !currentPost.currency || !currentPost.quantity) {
      setErrorMessage("All fields are required.");
      return;
    }

    let imageUrl = currentPost.imageurl;

    if (selectedImage) {
      imageUrl = await uploadImage(selectedImage);
      if (!imageUrl) return;
    }

    const postData = { ...currentPost, imageurl: imageUrl };

    try {
      if (editingPostId) {
        await axios.put(`/seller/products/${editingPostId}`, postData);
      } else {
        await axios.post("/seller/createProduct", {
          ...postData,
          createdby: sellerId,
        });
      }
      fetchPosts();
      handleCloseModal();
    } catch (error) {
      setErrorMessage(`Failed to ${editingPostId ? "update" : "add"} post`);
    }
  };
  const handleEditPost = (post) => {
    setCurrentPost(post);
    setEditingPostId(post._id);
    setOpenModal(true);
  };
  const handleArchiveToggle = async (postId, isArchived) => {
    try {
      // Update the local state first
      setPosts(posts.map(post =>
          post._id === postId ? { ...post, archived: isArchived } : post
      ));
      console.log("Local state updated");

      // Make a request to the server to update the archived status
      await axios.put(`/seller/products/${postId}`, { archived: isArchived });
      console.log("Archived status updated successfully");

    } catch (error) {
      console.error("Error updating archived status:", error);
      // Optionally, revert the local state if the API call fails
      setPosts(posts.map(post =>
          post._id === postId ? { ...post, archived: !isArchived } : post
      ));
    }
  };

  // Search, Filter, and Sort functionality
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.details
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesPrice =
        (minPrice === "" || post.price >= minPrice) &&
        (maxPrice === "" || post.price <= maxPrice);
    return matchesSearch && matchesPrice;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "rating") {
      return b.rating - a.rating; // Adjust according to your rating property
    }
    return 0; // No sorting by default
  });

  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      <div className="container py-4">
        <div className={styles.pageHeader}>
          <h1>Seller Dashboard</h1>
          {/* <p>Manage your products and inventory</p> */}
          <Button 
            variant="contained" 
            onClick={handleOpenModal}
            className={styles.addButton}
          >
            <i className="fas fa-plus me-2"></i>
            Add New Product
          </Button>
        </div>

        <div className={styles.controlPanel}>
          {/* Search and Filters */}
          <div className="row g-4">
            <div className="col-md-6">
              <div className={styles.searchBox}>
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className={styles.filterGroup}>
                <div className="row g-3">
                  <div className="col-6">
                    <div className={styles.priceFilter}>
                      <input
                        type="number"
                        placeholder="Min Price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className={styles.priceFilter}>
                      <input
                        type="number"
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <div className={styles.sortGroup}>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-select"
                >
                  <option value="">Sort by...</option>
                  <option value="rating">Rating (High to Low)</option>
                  <option value="price">Price (Low to High)</option>
                  <option value="-price">Price (High to Low)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className={styles.productsGrid}>
          {sortedPosts.map((post) => (
            <div key={post._id} className={styles.productCard}>
              <div className={styles.productImage}>
                <img src={post.imageurl} alt={post.details} />
                {post.archived && (
                  <div className={styles.archivedBadge}>Archived</div>
                )}
              </div>
              
              <div className={styles.productContent}>
                <h3>{post.details}</h3>
                
                <div className={styles.productMeta}>
                  <div className={styles.price}>
                    {post.price} {post.currency}
                  </div>
                  <div className={styles.quantity}>
                    Stock: {post.quantity}
                  </div>
                </div>

                <div className={styles.rating}>
                  <Rating
                    value={Math.round(post.rating * 2) / 2}
                    precision={0.5}
                    readOnly
                  />
                </div>

                <div className={styles.productActions}>
                  <button 
                    onClick={() => handleEditPost(post)}
                    className={styles.editButton}
                  >
                    <i className="fas fa-edit me-2"></i>
                    Edit
                  </button>
                  
                  <div className={styles.archiveControl}>
                    <label className={styles.archiveLabel}>
                      <span>Archive</span>
                      <label className={styles.toggleSwitch}>
                        <input
                          type="checkbox"
                          checked={post.archived}
                          onChange={(e) => handleArchiveToggle(post._id, e.target.checked)}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal - keep existing modal code */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h4 className="m-0 text-black">
                {editingPostId ? "Edit Product" : "Add New Product"}
              </h4>
              <button 
                className={styles.closeButton}
                onClick={handleCloseModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              {errorMessage && (
                <div className="alert alert-danger mb-4">
                  {errorMessage}
                </div>
              )}

              <div className="mb-4">
                <label className="form-label">Product Details</label>
                <textarea
                  className="form-control"
                  name="details"
                  value={currentPost.details}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Enter product description..."
                />
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label">Price</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-dollar-sign"></i>
                    </span>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={currentPost.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Currency</label>
                  <select
                    className="form-select"
                    name="currency"
                    value={currentPost.currency}
                    onChange={handleInputChange}
                  >
                    <option value="">Select currency</option>
                    {currencyCodes.map(code => (
                      <option key={code} value={code}>{code}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label">Quantity</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-boxes"></i>
                  </span>
                  <input
                    type="number"
                    className="form-control"
                    name="quantity"
                    value={currentPost.quantity}
                    onChange={handleInputChange}
                    placeholder="Enter quantity"
                  />
                </div>
              </div>

              <div className={styles.imageUploadSection}>
                <label className="form-label d-block">Product Image</label>
                {selectedImage || currentPost.imageurl ? (
                  <div className={styles.imagePreview}>
                    <img 
                      src={selectedImage ? URL.createObjectURL(selectedImage) : currentPost.imageurl} 
                      alt="Preview" 
                    />
                    <button 
                      className={styles.removeImage} 
                      onClick={() => setSelectedImage(null)}
                      type="button"
                    >
                      x
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ) : (
                  <div className={styles.dropZone}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="d-none"
                      id="imageInput"
                    />
                    <label htmlFor="imageInput" className={styles.uploadLabel}>
                      <i className="fas fa-cloud-upload-alt mb-2"></i>
                      <span>Click to upload image</span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleSubmitPost}
              >
                {editingPostId ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default Seller;