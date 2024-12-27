import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, TextField, Typography, Alert, InputLabel, MenuItem, FormControl, Select, IconButton } from '@mui/material';
import axios from 'axios';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../server/config/Firebase';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import 'leaflet/dist/leaflet.css';
import styles from './CreateHistoricalPlace.module.css';
import L from 'leaflet';
import { FaUpload, FaImage } from 'react-icons/fa';

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
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = React.useRef(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('/toursimgovernor/gettags'); // Update with your actual API endpoint
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
        const response = await axios.get(import.meta.env.VITE_EXCHANGE_API_URL);
        setCurrencyCodes(Object.keys(response.data.conversion_rates));
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchExchangeRates();
  }, []);

  // Fetch available tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('/toursimgovernor/gettags');
        setAvailableTags(response.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
        setErrorMessage('Failed to fetch tags');
      }
    };
    fetchTags();
  }, []);

  // Fetch currencies
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_EXCHANGE_API_URL);
        setCurrencies(Object.keys(response.data.conversion_rates));
        setSelectedCurrency('EGP'); // Default currency
      } catch (error) {
        console.error('Error fetching currencies:', error);
        setErrorMessage('Failed to fetch currencies');
      }
    };
    fetchCurrencies();
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

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5242880) { // 5MB limit
        setErrorMessage('Image size should be less than 5MB');
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage('Please upload a valid image file (JPG, JPEG, or PNG)');
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setErrorMessage('');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return null;

    try {
      const storageRef = ref(storage, `images/${Date.now()}_${selectedImage.name}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedImage);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            setErrorMessage('Failed to upload image');
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              setUploadProgress(0);
              resolve(downloadURL);
            } catch (error) {
              console.error('Get URL error:', error);
              setErrorMessage('Failed to get image URL');
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error('Upload setup error:', error);
      setErrorMessage('Failed to setup image upload');
      return null;
    }
  };

  const handleSubmitPlace = async () => {
    try {
      let imageUrl = historicalPlace.pictures;

      if (selectedImage) {
        imageUrl = await handleImageUpload();
        if (!imageUrl) {
          setErrorMessage('Failed to upload image');
          return;
        }
      }

      // Split tagNames by comma and trim whitespace
      const tagsArray = historicalPlace.tagNames.split(',').map(tag => tag.trim());

      const placeData = { ...historicalPlace, pictures: imageUrl, tagNames: tagsArray };

      // Validate required fields
      if (!placeData.description || !placeData.coordinates.lat || !placeData.coordinates.lng || !placeData.openingHours || !placeData.ticketPrices || !placeData.currency || !placeData.tagNames.length || !placeData.createdby) {
        console.log(placeData)
        setErrorMessage('All fields are required');
        return;
      }

      console.log('Data sent in POST request:', placeData); // Print data to console

      await axios.post('/toursimgovernor/placesId', placeData);
      handleCloseModal();
      navigate('/');
    } catch (error) {
      console.error('Submission error:', error);
      setErrorMessage('Failed to submit historical place');
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

  const handleTagChange = (event) => {
    setSelectedTags(event.target.value);
    setHistoricalPlace(prev => ({
      ...prev,
      tagNames: event.target.value.join(',') // If the API expects a comma-separated string
    }));
  };

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
    setHistoricalPlace(prev => ({
      ...prev,
      currency: event.target.value
    }));
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
                <FormControl fullWidth className={styles.formControl}>
                  <InputLabel id="currency-label">Currency</InputLabel>
                  <Select
                    labelId="currency-label"
                    id="currency-select"
                    value={selectedCurrency}
                    onChange={handleCurrencyChange}
                    label="Currency"
                  >
                    {currencies.map((currency) => (
                      <MenuItem key={currency} value={currency}>
                        {currency}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="col-12">
                <FormControl fullWidth className={styles.formControl}>
                  <InputLabel id="tags-label">Tags</InputLabel>
                  <Select
                    labelId="tags-label"
                    id="tags-select"
                    multiple
                    value={selectedTags}
                    onChange={handleTagChange}
                    label="Tags"
                    renderValue={(selected) => (
                      <div className={styles.selectedTags}>
                        {selected.map((value) => (
                          <span key={value} className={styles.tagChip}>
                            {availableTags.find(tag => tag._id === value)?.name}
                          </span>
                        ))}
                      </div>
                    )}
                  >
                    {availableTags.map((tag) => (
                      <MenuItem key={tag._id} value={tag._id}>
                        {tag.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="col-12">
                <div className={styles.imageUploadSection}>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    Upload Image
                  </Typography>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />

                  <div className={styles.uploadArea} onClick={triggerFileInput}>
                    {imagePreview ? (
                      <div className={styles.previewContainer}>
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className={styles.imagePreview}
                        />
                        <IconButton 
                          className={styles.changeImageButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerFileInput();
                          }}
                        >
                          <FaUpload />
                        </IconButton>
                      </div>
                    ) : (
                      <div className={styles.uploadPrompt}>
                        <FaImage className={styles.uploadIcon} />
                        <Typography>
                          Click to upload image
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          JPG, JPEG, or PNG (max 5MB)
                        </Typography>
                      </div>
                    )}
                  </div>

                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill} 
                        style={{ width: `${uploadProgress}%` }}
                      />
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