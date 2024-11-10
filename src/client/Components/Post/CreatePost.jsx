import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Modal,
  TextField,
  Typography,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../server/config/Firebase";
import styles from "./CreatePost.module.css";
import Footer from "/src/client/Components/Footer/Footer";
import Header from "/src/client/Components/Header/Header";

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

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(
          "https://v6.exchangerate-api.com/v6/d9449bff3fa7ff19888a796e/latest/EGP"
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
    let imageUrl = currentPost.imageurl;

    if (selectedImage) {
      imageUrl = await uploadImage(selectedImage);
      if (!imageUrl) return;
    }

    const postData = { ...currentPost, imageurl: imageUrl };

    try {
      await axios.post("/admin/createProduct", postData);
      handleCloseModal();
    } catch (error) {
      setErrorMessage("Failed to add post");
    }
  };

  return (
    <Modal open={openModal} onClose={handleCloseModal}>
      <div className={styles.modalOverlay}>
        <Header />
        <div className={styles.modalContainer}>
        <h2 style={{color: 'white', fontWeight: 'bold'}}>Create new Post</h2>
          {errorMessage && (
            <Alert severity="error" className={styles.alert}>
              {errorMessage}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Details"
            name="details"
            value={currentPost.details}
            onChange={handleInputChange}
            margin="normal"
            className={styles.inputField}
          />
          <TextField
            fullWidth
            label="Price"
            name="price"
            type="number"
            value={currentPost.price}
            onChange={handleInputChange}
            margin="normal"
            className={styles.inputField}
          />
          <FormControl fullWidth margin="normal" className={styles.inputField}>
            <InputLabel>Currency</InputLabel>
            <Select
              name="currency"
              value={currentPost.currency}
              onChange={handleInputChange}
            >
              {currencyCodes.map((code) => (
                <MenuItem key={code} value={code}>
                  {code}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Details"
            name="details"
            value={currentPost.details}
            onChange={handleInputChange}
            margin="normal"
            className={styles.inputField}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.fileInput}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitPost}
            className={styles.submitButton}
          >
            Add Post
          </Button>
        </div>
        <Footer />
      </div>
    </Modal>
  );
};

export default CreatePost;
