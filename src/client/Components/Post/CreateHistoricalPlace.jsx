import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Modal, TextField, Typography, Alert, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import axios from 'axios';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../server/config/Firebase';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fixing marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
});

const CreateHistoricalPlace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId: createdBy } = location.state || {}; // Retrieve createdBy from location.state
  const [openModal, setOpenModal] = useState(true); // Open the modal by default
  const [historicalPlace, setHistoricalPlace] = useState({
    description: '',
    coordinates: { lat: null, lng: null },
    openingHours: '',
    ticketPrices: '',
    currency: '',
    tagNames: '',
    pictures: '',
    createdby: createdBy || '', // Ensure createdBy is set correctly
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('http://localhost:3000/toursimgovernor/gettags'); // Update with your actual API endpoint
        setTags(response.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

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

    // Validate required fields
    if (!placeData.description || !placeData.coordinates.lat || !placeData.coordinates.lng || !placeData.openingHours || !placeData.ticketPrices || !placeData.currency || !placeData.tagNames.length || !placeData.createdby) {
      setErrorMessage('All fields are required');
      return;
    }

    console.log('Data sent in POST request:', placeData); // Print data to console

    try {
      await axios.post('http://localhost:3000/toursimgovernor/placesId', placeData);
      handleCloseModal();
      navigate('/');
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(`Failed to add historical place: ${error.response.data.error}`);
      } else {
        setErrorMessage('Failed to add historical place: An unexpected error occurred');
      }
      console.error('Error creating historical place:', error);
      console.log('Request payload:', placeData);
    }
  };

  const LocationMap = () => {
    useMapEvents({
      click(e) {
        setHistoricalPlace({
          ...historicalPlace,
          coordinates: { lat: e.latlng.lat, lng: e.latlng.lng },
        });
        console.log(`Coordinates selected: lat: ${e.latlng.lat}, lng: ${e.latlng.lng}`);
      },
    });
    return null;
  };

  return (
      <Modal open={openModal} onClose={handleCloseModal}>
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          margin: '100px auto',
          width: '80%',
          maxWidth: '600px',
          height: '80%',
          overflowY: 'auto'
        }}>
          <Typography variant="h6" style={{ color: 'black' }}>Create Historical Place</Typography>
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
          <FormControl fullWidth margin="normal">
            <InputLabel>Currency</InputLabel>
            <Select
                name="currency"
                value={historicalPlace.currency}
                onChange={handleInputChange}
            >
              <MenuItem value="EGP">EGP</MenuItem>
              <MenuItem value="SAR">SAR</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
              <MenuItem value="GBP">GBP</MenuItem>
            </Select>
          </FormControl>
          {tags.length > 0 && (
              <div>
                <Typography variant="h6" style={{ color: 'black' }}>Available Tags:</Typography>
                <ul style={{ color: 'black' }}>
                  {tags.map((tag) => (
                      <li key={tag._id}>{tag.name}</li>
                  ))}
                </ul>
              </div>
          )}
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

          {/* Map Section */}
          <div style={{ height: '300px', marginTop: '20px' }}>
            <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMap />
              {historicalPlace.coordinates.lat && historicalPlace.coordinates.lng && (
                  <Marker position={[historicalPlace.coordinates.lat, historicalPlace.coordinates.lng]} />
              )}
            </MapContainer>
          </div>

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