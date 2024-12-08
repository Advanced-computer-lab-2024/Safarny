import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, TextField, Typography, Alert, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import axios from 'axios';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../server/config/Firebase';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import 'leaflet/dist/leaflet.css';
import styles from './CreateHistoricalPlace.module.css';
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
  const [currencyCodes, setCurrencyCodes] = useState([]);

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

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get('https://v6.exchangerate-api.com/v6/033795aceeb35bc666391ed5/latest/EGP');
        setCurrencyCodes(Object.keys(response.data.conversion_rates));
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchExchangeRates();
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
    <div className={styles.pageWrapper}>
      <Header />
      
      <div className="container-fluid py-5" style={{ width: '100vw' }}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <Typography variant="h4" className={styles.title}>
              Create Historical Place
            </Typography>
            {errorMessage && (
              <Alert severity="error" className="mb-4">
                {errorMessage}
              </Alert>
            )}
          </div>

          <div className={styles.formContent}>
            <div className="row g-4">
              <div className="col-md-6">
                <div className={styles.inputGroup}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={historicalPlace.description}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className={styles.inputGroup}>
                  <TextField
                    fullWidth
                    label="Opening Hours"
                    name="openingHours"
                    value={historicalPlace.openingHours}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className={styles.inputGroup}>
                  <TextField
                    fullWidth
                    label="Ticket Prices"
                    name="ticketPrices"
                    value={historicalPlace.ticketPrices}
                    onChange={handleInputChange}
                    className={styles.input}
                    type="number"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className={styles.inputGroup}>
                  <FormControl fullWidth>
                    <InputLabel className={styles.selectLabel}>Currency</InputLabel>
                    <Select
                      name="currency"
                      value={historicalPlace.currency}
                      onChange={handleInputChange}
                      className={styles.select}
                    >
                      {currencyCodes.map(code => (
                        <MenuItem key={code} value={code}>{code}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>

              <div className="col-12">
                <div className={styles.tagsSection}>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    Available Tags
                  </Typography>
                  <div className={styles.tagsList}>
                    {tags.map((tag) => (
                      <span key={tag._id} className={styles.tag}>
                        {tag.name}
                      </span>
                    ))}
                  </div>
                  <TextField
                    fullWidth
                    label="Tag Names (comma separated)"
                    name="tagNames"
                    value={historicalPlace.tagNames}
                    onChange={handleInputChange}
                    className={`${styles.input} mt-3`}
                    helperText="Enter tags separated by commas"
                  />
                </div>
              </div>

              <div className="col-12">
                <div className={styles.imageUpload}>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    Upload Image
                  </Typography>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.fileInput}
                  />
                  {selectedImage && (
                    <div className={styles.selectedImage}>
                      <Typography variant="body2">
                        Selected: {selectedImage.name}
                      </Typography>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-12">
                <div className={styles.mapSection}>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    Select Location
                  </Typography>
                  <div className={styles.mapContainer}>
                    <MapContainer
                      center={[30.0444, 31.2357]} // Cairo coordinates
                      zoom={13}
                      style={{ height: '400px', width: '100%' }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <LocationMap />
                      {historicalPlace.coordinates.lat && historicalPlace.coordinates.lng && (
                        <Marker
                          position={[
                            historicalPlace.coordinates.lat,
                            historicalPlace.coordinates.lng
                          ]}
                        />
                      )}
                    </MapContainer>
                  </div>
                  {historicalPlace.coordinates.lat && historicalPlace.coordinates.lng && (
                    <Typography variant="body2" className={styles.coordinates}>
                      Selected coordinates: {historicalPlace.coordinates.lat.toFixed(4)}, {historicalPlace.coordinates.lng.toFixed(4)}
                    </Typography>
                  )}
                </div>
              </div>

              <div className="col-12">
                <div className={styles.actionButtons}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitPlace}
                    className={styles.submitButton}
                  >
                    Create Historical Place
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/')}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreateHistoricalPlace;