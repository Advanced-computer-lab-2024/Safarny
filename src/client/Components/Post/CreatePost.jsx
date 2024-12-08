import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../server/config/Firebase";
import styles from "./CreatePost.module.css";
import Footer from "/src/client/Components/Footer/Footer";
import Header from "/src/client/Components/Header/Header";
import { FaUpload, FaImage, FaDollarSign, FaBoxOpen, FaGlobe } from 'react-icons/fa';

const CreatePost = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(true);
  const [currentPost, setCurrentPost] = useState({
    details: "",
    price: "",
    currency: "",
    quantity: "",
    imageurl: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [currencyCodes, setCurrencyCodes] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const { userId } = location.state || {};

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(
        import.meta.env.VITE_EXCHANGE_API_URL
      );
        setCurrencyCodes(Object.keys(response.data.conversion_rates));
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    fetchExchangeRates();
  }, []);

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
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
      setErrorMessage("All fields are required!");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = currentPost.imageurl;
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
        if (!imageUrl) throw new Error("Failed to upload image");
      }

      const postData = { ...currentPost, imageurl: imageUrl, createdby: userId };
      const userResponse = await axios.get(`/tourist/${userId}`);
      const userRole = userResponse.data.role;

      if (userRole === 'Admin') {
        await axios.post("/admin/createProduct", postData);
      } else if (userRole === 'Seller') {
        await axios.post("/seller/createProduct", postData);
      } else {
        throw new Error("User does not have permission to create a post");
      }

      setSuccessMessage("Post added successfully");
      // setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      setErrorMessage(error.message || "Failed to add post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${styles.pageWrapper} min-vh-100`}>
      <Header />
      <main className={`${styles.mainContent} py-5`}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className={`${styles.formCard} card shadow-lg`}>
                <div className="card-body p-4">
                  <h2 className="text-center mb-4">Create New Post</h2>
                  
                  {(errorMessage || successMessage) && (
                    <div className={`alert ${errorMessage ? 'alert-danger' : 'alert-success'} mb-4`}>
                      {errorMessage || successMessage}
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="form-label">Details</label>
                    <textarea
                      className="form-control"
                      name="details"
                      value={currentPost.details}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Enter post details..."
                    />
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label className="form-label">
                        <FaDollarSign className="me-2" />
                        Price
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={currentPost.price}
                        onChange={handleInputChange}
                        placeholder="Enter price"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        <FaGlobe className="me-2" />
                        Currency
                      </label>
                      <select
                        className="form-select"
                        name="currency"
                        value={currentPost.currency}
                        onChange={handleInputChange}
                      >
                        <option value="">Select currency</option>
                        {currencyCodes.map((code) => (
                          <option key={code} value={code}>{code}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">
                      <FaBoxOpen className="me-2" />
                      Quantity
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="quantity"
                      value={currentPost.quantity}
                      onChange={handleInputChange}
                      placeholder="Enter quantity"
                    />
                  </div>

                  <div className={`${styles.imageUpload} mb-4`}>
                    <label className="form-label">
                      <FaImage className="me-2" />
                      Product Image
                    </label>
                    <div className="d-flex flex-column align-items-center">
                      {imagePreview && (
                        <div className={styles.imagePreviewContainer}>
                          <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                        </div>
                      )}
                      <label className={styles.uploadButton}>
                        <FaUpload className="me-2" />
                        Choose Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="d-none"
                        />
                      </label>
                    </div>
                  </div>

                  <button
                    className={`btn btn-primary w-100 ${styles.submitButton}`}
                    onClick={handleSubmitPost}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Creating Post...
                      </>
                    ) : (
                      'Create Post'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreatePost;
