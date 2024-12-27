import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./TourGuide.module.css";
import {
  Button,
  TextField,
  Tabs,
  Tab,
  Box,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Tooltip,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import EditItineraryForm from "./EditItineraryForm";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import { FaRoute, FaPlus, FaEdit, FaTrash, FaGlobe, FaClock, FaMapMarkerAlt, FaAccessibleIcon, FaCalendarAlt } from 'react-icons/fa';

export default function TourGuide() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state;
  const [itineraries, setItineraries] = useState([]);
  const [activities, setActivities] = useState([]);
  const [tags, setTags] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [boughtCounts, setBoughtCounts] = useState({});

  const [profile, setProfile] = useState({
    PrevWork: "",
    YearOfExp: 0,
  });
  const [tabValue, setTabValue] = useState(0);
  const handleHourIncrease = () =>
    setHours((prev) => (prev === 12 ? 1 : prev + 1));
  const handleHourDecrease = () =>
    setHours((prev) => (prev === 1 ? 12 : prev - 1));
  const handleMinuteIncrease = () =>
    setMinutes((prev) => (prev === 59 ? 0 : prev + 1));
  const handleMinuteDecrease = () =>
    setMinutes((prev) => (prev === 0 ? 59 : prev - 1));

  const handlePeriodChange = (event) => setPeriod(event.target.value);
  const [newItinerary, setNewItinerary] = useState({
    name: "",
    activities: [],
    locations: [],
    timeline: [],
    duration: 0,
    language: "",
    price: 0,
    currency: "",
    availableDates: [],
    availableTimes: [],
    accessibility: true,
    bookingOpen: "in-active",
    pickupLocation: "",
    dropoffLocation: "",
    tagNames: [],
  });
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleActivityChange = (index, e) => {
    const { name, value } = e.target;
    const updatedActivities = [...formData.activities];
    updatedActivities[index] = { ...updatedActivities[index], [name]: value };
    setFormData({ ...formData, activities: updatedActivities });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const userId = "670155dc63c71fd000903246";
        const profileResponse = await axios.get(
          `/tourguide/get-my-tourguide-details?id=${userId}`
        );
        setProfile(profileResponse.data);

        const itinerariesResponse = await axios.get(
          `/tourguide/get-my-tourguide-itineraries/${userId}`
        );
        setItineraries(itinerariesResponse.data);
        console.log("itineraries: ", itinerariesResponse.data);
        const counts = await Promise.all(
          itinerariesResponse.data.map(async (itineraries) => {
              try {
                  const countRes = await fetch(`/tourguide/getClientsByItinerary/${itineraries._id}`);
                  const countData = await countRes.json();
                 
                  return { [itineraries._id]: countData.boughtCount };
                  
              } catch {
                  return { [itineraries._id]: 0 }; // Default to 0 if error occurs
              }
          })
      );

      const countsMap = counts.reduce((acc, count) => ({ ...acc, ...count }), {});
      setBoughtCounts(countsMap);

        // Fetch activities and tags
        const activitiesResponse = await axios.get(
          "/tourguide/get-activities"
        );
        setActivities(activitiesResponse.data); // Assuming it's an array of activities
        const tagsResponse = await axios.get(
          "/tourguide/get-tags"
        );
        setTags(tagsResponse.data); // Assuming it's an array of tags
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get("https://api.exchangerate-api.com/v4/latest/USD");
        setCurrencies(Object.keys(response.data.rates));
      } catch (error) {
        console.error("Error fetching currencies", error);
      }
    };

    fetchCurrencies();
  }, []);
  const handleCreateItinerary = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
          "/tourguide/create-itineraries",
          { ...newItinerary, createdby: userId, currency: selectedCurrency }
      );
      setItineraries([...itineraries, response.data]);
      setSnackbar({
        open: true,
        message: 'Itinerary created successfully!',
        severity: 'success'
      });
      setTabValue(0); // Switch back to the itineraries list
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error creating itinerary',
        severity: 'error'
      });
      console.error("Error creating itinerary", error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `/tourguide/edit-my-tourguide-profile/${profile.id}`,
        profile
      );
      setProfile(response.data);
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle edit button click
  const handleEditClick = async (itineraryId) => {
    try {
      const response = await axios.get(
        `/tourguide/get-itineraries/${itineraryId}`
      );
      setSelectedItinerary(response.data);
      setEditModalOpen(true); // Open the edit modal
    } catch (error) {
      console.error("Error fetching itinerary", error);
    }
  };

  // Handle delete button click
  const handleDeleteClick = async (itineraryId) => {
    try {
      await axios.delete(
        `/tourguide/delete-itineraries/${itineraryId}`
      );
      // Refresh the itineraries list
      const response = await axios.get(
        `/tourguide/get-my-tourguide-itineraries/${userId}`
      );
      setItineraries(response.data);
      setSnackbar({
        open: true,
        message: 'Itinerary deleted successfully!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error deleting itinerary',
        severity: 'error'
      });
      console.error("Error deleting itinerary", error);
    }
  };

  // Handle update itinerary
  const handleUpdateItinerary = async (updatedItinerary) => {
    try {
      // Create a shallow copy and remove rating and averageRating
      const { rating, averageRating, ...itineraryToUpdate } = updatedItinerary;

      const response = await axios.put(
        `/tourguide/edit-itineraries/${updatedItinerary._id}`,
        itineraryToUpdate
      );

      // Update the itineraries list with the edited itinerary
      const updatedItineraries = itineraries.map((itinerary) =>
        itinerary._id === updatedItinerary._id ? response.data : itinerary
      );
      setItineraries(updatedItineraries);
      setEditModalOpen(false);
      
      setSnackbar({
        open: true,
        message: 'Itinerary updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error updating itinerary',
        severity: 'error'
      });
      console.error("Error updating itinerary", error);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <main className={styles.mainContent} style={{ width: '100vw' }}>
        <Container fluid className="p-0">
          <div className={`${styles.dashboardHeader} text-center py-4 mb-4`}>
            <Typography variant="h3" component="h1" className="mb-2">
              <FaRoute className="me-2" />
              Tour Guide Dashboard
            </Typography>
            <Typography variant="subtitle1" className="text-muted">
              Manage your itineraries and bookings
            </Typography>
          </div>

          <Box className="px-4">
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="Tour Guide Tabs"
              className={`${styles.customTabs} mb-4`}
              centered
            >
              <Tab label="My Itineraries" />
              <Tab label="Create New Itinerary" />
            </Tabs>

            {tabValue === 0 && (
              <div className={styles.itinerariesGrid}>
                {itineraries.map((itinerary) => (
                  <Card key={itinerary._id} className={`${styles.itineraryCard} shadow-sm`}>
                    <CardHeader
                      title={itinerary.name}
                      className={styles.cardHeader}
                    />
                    <CardContent className={styles.cardContent}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className={styles.infoItem}>
                            <FaGlobe className={styles.icon} />
                            <Typography variant="body1">
                              Language: {itinerary.language}
                            </Typography>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className={styles.infoItem}>
                            <FaClock className={styles.icon} />
                            <Typography variant="body1">
                              Duration: {itinerary.duration} mins
                            </Typography>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className={styles.infoItem}>
                            <Typography variant="body1" className={styles.price}>
                              ${itinerary.price} {itinerary.currency}
                            </Typography>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className={styles.infoItem}>
                            <FaAccessibleIcon className={styles.icon} />
                            <Typography variant="body1">
                              Accessible: {itinerary.accessibility ? "Yes" : "No"}
                            </Typography>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className={styles.infoItem}>
                            <FaMapMarkerAlt className={styles.icon} />
                            <Typography variant="body1">
                              Pickup: {itinerary.pickupLocation}
                            </Typography>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className={styles.infoItem}>
                            <FaMapMarkerAlt className={styles.icon} />
                            <Typography variant="body1">
                              Dropoff: {itinerary.dropoffLocation}
                            </Typography>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className={styles.bookingStatus}>
                            <span className={`badge ${itinerary.bookingOpen === "active" ? "bg-success" : "bg-secondary"}`}>
                              {itinerary.bookingOpen === "active" ? "Booking Open" : "Booking Closed"}
                            </span>
                          </div>
                        </div>
                        <div className="col-12">
                          <Typography variant="body2" className={styles.boughtCount}>
                            Bought Count: {boughtCounts[itinerary._id] || 0}
                          </Typography>
                        </div>
                      </div>
                    </CardContent>
                    <CardActions className={`${styles.cardActions} justify-content-end gap-2 p-3`}>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<FaEdit />}
                        onClick={() => handleEditClick(itinerary._id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<FaTrash />}
                        onClick={() => handleDeleteClick(itinerary._id)}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </div>
            )}

            {tabValue === 1 && (
              <Card className={`${styles.createForm} shadow`}>
                <CardHeader 
                  title="Create New Itinerary"
                  subheader="Fill in the details for your new tour itinerary"
                  className={styles.createFormHeader}
                />
                <CardContent>
                  <form onSubmit={handleCreateItinerary}>
                    <div className="row g-3">
                      <div className="col-12">
                        <div className={styles.formGroup}>
                          <TextField
                            fullWidth
                            label="Itinerary Name"
                            value={newItinerary.name}
                            onChange={(e) => setNewItinerary({...newItinerary, name: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className={styles.formGroup}>
                          <TextField
                            fullWidth
                            label="Language"
                            value={newItinerary.language}
                            onChange={(e) => setNewItinerary({...newItinerary, language: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className={styles.formGroup}>
                          <TextField
                            type="number"
                            fullWidth
                            label="Duration (minutes)"
                            value={newItinerary.duration}
                            onChange={(e) => setNewItinerary({...newItinerary, duration: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className={styles.formGroup}>
                          <TextField
                            type="number"
                            fullWidth
                            label="Price"
                            value={newItinerary.price}
                            onChange={(e) => setNewItinerary({...newItinerary, price: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className={styles.formGroup}>
                          <FormControl fullWidth>
                            <InputLabel>Currency</InputLabel>
                            <Select
                              value={selectedCurrency}
                              onChange={(e) => setSelectedCurrency(e.target.value)}
                              required
                            >
                              {currencies.map((currency) => (
                                <MenuItem key={currency} value={currency}>
                                  {currency}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className={styles.formGroup}>
                          <TextField
                            fullWidth
                            label="Pickup Location"
                            value={newItinerary.pickupLocation}
                            onChange={(e) => setNewItinerary({...newItinerary, pickupLocation: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <div className={styles.formGroup}>
                          <TextField
                            fullWidth
                            label="Dropoff Location"
                            value={newItinerary.dropoffLocation}
                            onChange={(e) => setNewItinerary({...newItinerary, dropoffLocation: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <div className={styles.formGroup}>
                          <FormControl fullWidth>
                            <InputLabel>Accessibility</InputLabel>
                            <Select
                              value={newItinerary.accessibility}
                              onChange={(e) => setNewItinerary({...newItinerary, accessibility: e.target.value})}
                            >
                              <MenuItem value={true}>Yes</MenuItem>
                              <MenuItem value={false}>No</MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                      </div>

                      <div className="col-12">
                        <Button
                          type="submit"
                          variant="contained"
                          className={styles.submitButton}
                          startIcon={<FaPlus />}
                          fullWidth
                        >
                          Create Itinerary
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </Box>
        </Container>
      </main>
      <Footer />

      {/* Edit Modal */}
      {isEditModalOpen && selectedItinerary && (
        <EditItineraryForm
          itinerary={selectedItinerary}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedItinerary(null);
          }}
          onSave={handleUpdateItinerary}
          currencies={currencies}
        />
      )}

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
