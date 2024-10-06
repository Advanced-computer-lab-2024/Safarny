import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, TextField, Typography, Alert } from '@mui/material';
import axios from 'axios';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../server/config/Firebase';

//const response = await fetch(`/TourismGovernor/profile/${userId}`);
const CreateHistoricalPlace = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(true); // Open the modal by default
  const [historicalPlace, setHistoricalPlace] = useState({
    description: '',
    location: '',
    openingHours: '',
    ticketPrices: '',
    tagNames: '',
    pictures: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCloseModal = () => {
    setOpenModal(false);
    setErrorMessage('');
    setSelectedImage(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHistoricalPlace({ ...historicalPlace, [name]: value });
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
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleSubmitPlace = async () => {
    let imageUrl = historicalPlace.pictures;

    if (selectedImage) {
      imageUrl = await uploadImage(selectedImage);
      if (!imageUrl) return;
    }

    // Split tagNames by comma and trim whitespace
    const tagsArray = historicalPlace.tagNames.split(',').map(tag => tag.trim());

    const placeData = { ...historicalPlace, pictures: imageUrl, tagNames: tagsArray };

    try {
      await axios.post('http://localhost:3000/toursimgovernor/places', placeData);
      handleCloseModal();
      navigate('/Profile', { state: { userId } });
    } catch (error) {
      setErrorMessage(`Failed to add historical place: ${error.response.data.error}`);
      console.error('Error creating historical place:', error);
      console.log('Request payload:', placeData);
    }
  };

  return (
    <Modal open={openModal} onClose={handleCloseModal}>
      <div style={{ padding: '20px', backgroundColor: 'white', margin: '100px auto', width: '400px' }}>
        <Typography variant="h6">Create Historical Place</Typography>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <TextField
          fullWidth
          label="Description"
          name="description"
          value={historicalPlace.description}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Location"
          name="location"
          value={historicalPlace.location}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Opening Hours"
          name="openingHours"
          value={historicalPlace.openingHours}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Ticket Prices"
          name="ticketPrices"
          value={historicalPlace.ticketPrices}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Tag Names (comma separated)"
          name="tagNames"
          value={historicalPlace.tagNames}
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
          onClick={handleSubmitPlace}
          style={{ marginTop: '20px' }}
        >
          Add Historical Place
        </Button>
      </div>
    </Modal>
  );
};

export default CreateHistoricalPlace;