import React, { useEffect, useState } from "react";
import styles from "./UpcomingActivities.module.css";
import axios from 'axios';
import { Link, useNavigate , useLocation,} from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { FormControl, InputLabel, MenuItem, Select, CircularProgress } from "@mui/material";
import MyBookingModal from "/src/client/Components/Booking/MyBookingModal" ;
import Footer from '/src/client/Components/Footer/Footer';
import Header from '../Header/Header';
import { Rating } from "@mui/material";

const UpcomingActivities = () => {
  const location = useLocation();
  const { userId } = location.state || {};
  const [activities, setActivities] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("date");
  const [filterCriteria, setFilterCriteria] = useState("");
  const [budget, setBudget] = useState([0, 0]);
  const [dateRange, setDateRange] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('EGP');
  const [exchangeRates, setExchangeRates] = useState({});
  const [currencyCodes, setCurrencyCodes] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(0);
  const [walletCurrency, setWalletCurrency] = useState('EGP');
  const [userRole, setUserRole] = useState(''); // State for storing user role
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    role: "",
    image: "", // Added image field
  });
  const [loading, setLoading] = useState(true); // Add loading state

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);


  // Method to fetch user role
  const fetchUserRole = async () => {
    try {
      // Replace `userId` with the actual user ID if available
      const response = await axios.get(`http://localhost:3000/tourist/${userId}`);
      setUserRole(response.data.role); // Store user role in state
      const user = response.data;
      setWallet(user.wallet);
      setWalletCurrency(user.walletcurrency || 'EGP');
      setSelectedCurrency(user.walletcurrency || 'EGP');
      console.log('User role:', response.data.role); // Log user role for debugging
    } catch (err) {
      console.error('Error fetching user role:', err);
    }
  };

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_EXCHANGE_API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!data.conversion_rates) {
        throw new Error('Invalid data format');
      }
      setExchangeRates(data.conversion_rates);
      setCurrencyCodes(Object.keys(data.conversion_rates));
      console.log("id", userId);
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      setExchangeRates({ EGP: 1 }); // Set default exchange rate
      setCurrencyCodes(['EGP']); // Set default currency code
    }
  };
  useEffect(() => {
    fetchUserRole(); // Call to fetch user role
    fetchExchangeRates();
  }, []);

const handleArchiveToggle = async (ActivityId, isArchived) => {
  try {
    // Update the local state first
    setActivities(activities.map(activity =>
      activity._id === ActivityId ? { ...activity, archived: isArchived } : activity
    ));
    console.log("Local state updated");

    // Make a request to the server to update the archived status
    await axios.put(`/activities/${ActivityId}`, { archived: isArchived });
    console.log("Archived status updated successfully");

    // Send an email and notification to the creator of the activity if it is archived
    if (isArchived) {
      const activity = activities.find(activity => activity._id === ActivityId);
      const response = await axios.get(`/tourist/${activity.createdby}`);
      const creatorEmail = response.data.email;
      const creatorId = response.data._id;

      await axios.post('/email/send-activity-archived-email', {
        email: creatorEmail,
        name: activity.location
      });
      console.log("Email sent to the creator");

      // Send a notification to the creator
      const title = `Your activity "${activity.location}" has been archived`;
      const message = `The activity "${activity.location}" at ${activity.location} has been archived.`;
      await axios.post('/notification/create', {
        title,
        message,
        userId: creatorId
      });
      console.log("Notification sent to the creator");
    }
  } catch (error) {
    console.error("Error updating archived status:", error);
    // Optionally, revert the local state if the API call fails
    setActivities(activities.map(activity =>
      activity._id === ActivityId ? { ...activity, archived: !isArchived } : activity
    ));
  }
};
const convertPrice = (price, fromCurrency, toCurrency) => {
    if (price == null) {
      return 'N/A'; // Return 'N/A' or any default value if price is null
    }
    const rateFrom = exchangeRates[fromCurrency];
    const rateTo = exchangeRates[toCurrency];
    return ((price / rateFrom) * rateTo).toFixed(2);
  };

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        let url = `http://localhost:3000/guest/get-activities-sorted?sortBy=${sortCriteria}:desc`;

        if (filterCriteria === "budget") {
          url = `http://localhost:3000/guest/filter-activities?minBudget=${budget[0]}&maxBudget=${budget[1]}`;
        } else if (filterCriteria === "date") {
          url = `http://localhost:3000/guest/filter-activities?&date=${dateRange}`;
        } else if (filterCriteria === "category" && selectedCategories.length > 0) {
          url = `http://localhost:3000/guest/filter-activities?&category=${selectedCategories.join(",")}`;
        } else if (filterCriteria === "averageRating") {
          url = `http://localhost:3000/guest/filter-activities?&averageRating=${averageRating}`;
        }

        // Update the sort order for rating to descending
        if (sortCriteria === "averageRating") {
          url = `http://localhost:3000/guest/get-activities-sorted?sortBy=averageRating:desc`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch activities");
        }
        const data = await response.json();

        // Check if the user is a tourist
        if (userRole !== 'Advertiser' && userRole !== 'Admin') {
          // Filter activities to only include those that are not archived
          const filteredActivities = data.filter(activity => !activity.archived);
          setActivities(filteredActivities);
        } else {
          // If the user is not a tourist, set all activities without filtering
          setActivities(data);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchActivities();
  }, [sortCriteria, filterCriteria, budget, dateRange, selectedCategories, averageRating, userRole]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/advertiser/GetCategories");
        const categories = await response.json();
        setAvailableCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  const renderStars = (averageRating) => {
    if (averageRating == null) return null;
    return <Rating value={Math.round(averageRating * 2) / 2} precision={0.5} readOnly />;
  };
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
        prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category]
    );
  };

  const handleUpcomingActivitiesDetails = (activityId) => {
    navigate(`/UpcomingActivities/${activityId}`);
  };

  const GoToMyActivities  = () => {
    navigate("/MyActivities", { state: { userId } });
  };


  const handleActivityBook = (activityId) => {
    //use MyBookingModal.jsx to book an Activity
    setSelectedActivityId(activityId);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedActivityId(null);
  };

  const handleAddActivity = async (activity) => {
    try {
      console.log("User ID:", userId);
  
      // Fetch the current user profile
      const profileResponse = await axios.get(`http://localhost:3000/tourist/${userId}`);
      const currentActivities = profileResponse.data.activities || [];
  
      // Check if the activity is already in the user's activities
      if (currentActivities.includes(activity._id)) {
        alert(`The activity "${activity.title}" is already saved in your activities.`);
        return; // Exit the function early
      }
  
      // Add the activity ID to the user's activities array
      const updatedActivities = [...currentActivities, activity._id];
  
      // Update the user's profile with the updated activities array
      await axios.put(`http://localhost:3000/tourist/${userId}`, {
        id: userId,
        activities: updatedActivities,
      });
  
      // Update local state if needed
      alert(`Activity "${activity.title}" has been successfully added to your activities!`);
    } catch (err) {
      console.error('Error adding activity:', err);
      alert('An error occurred while adding the activity. Please try again.');
    }
  };
  
  
  
  return (
      <div className={styles.container}>
      <Header />
      {loading && <p>Loading...</p>}
      
        <main className={styles.main}>
          <h2>Upcoming Activities</h2>

          <div className={styles.sortOptions}>
            <button onClick={() => setSortCriteria("date")} className={styles.cardButton}>
              Sort by Date
            </button>
            <button onClick={() => setSortCriteria("price")} className={styles.cardButton}>
              Sort by Price
            </button>
            <button onClick={() => setSortCriteria("averageRating")} className={styles.cardButton}>
              Sort by Rating
            </button>
          </div>
          <div className={styles.navigationButtonContainer}>
    <button
      onClick={GoToMyActivities}
      className={styles.cardButton}
    >
      My Activities
    </button>
  </div>

          <div className={styles.filterOptions}>
            <label htmlFor="filter">Filter by: </label>
            <select id="filter" onChange={(e) => setFilterCriteria(e.target.value)} className={styles.filters}>
              <option value="">None</option>
              <option value="budget">Budget</option>
              <option value="date">Date</option>
              <option value="category">Category</option>
              <option value="averageRating">Rating</option>
            </select>
          </div>

          <div className={styles.currencySelector}>
            <FormControl fullWidth margin="normal">
              <InputLabel><h4>Currency</h4></InputLabel>
              <br></br>
              <Select value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)}>
                {currencyCodes.map(code => (
                    <MenuItem key={code} value={code}>{code}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {filterCriteria === "budget" && (
              <div className={styles.filterInput}>
                <label>Budget range: {budget[0]}$ - {budget[1]}$</label>
                <input type="range" min="0" max="1000" value={budget[0]} onChange={(e) => setBudget([+e.target.value, budget[1]])} />
                <input type="range" min="0" max="1000" value={budget[1]} onChange={(e) => setBudget([budget[0], +e.target.value])} />
              </div>
          )}

          {filterCriteria === "date" && (
              <div className={styles.filterInput}>
                <label>Select Date Range: </label>
                <input type="date" onChange={(e) => setDateRange(e.target.value)} />
              </div>
          )}

          {filterCriteria === "category" && availableCategories.length > 0 && (
              <div className={styles.filterInput}>
                <label>Select Categories:</label>
                {availableCategories.map((category) => (
                    <div key={category._id}>
                      <input type="checkbox" value={category.type} onChange={() => handleCategoryChange(category.type)} />
                      {category.type}
                    </div>
                ))}
              </div>
          )}

          {filterCriteria === "averageRating" && (
              <div className={styles.filterInput}>
                <label>Rating: {averageRating} </label>
                <input type="range" min="0" max="5" value={averageRating} onChange={(e) => setAverageRating(e.target.value)} />
              </div>
          )}

          <section className={styles.activityList}>
            {activities.length === 0 ? (
                <p>No upcoming activities found.</p>
            ) : (
                activities.map((activity) => {
                  const convertedPrice = convertPrice(activity.price, activity.currency, selectedCurrency);
                  return (
                      <div key={activity._id} className={styles.activityItem}>
                        <h3>{activity.name}</h3>
                        <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
                        <p>Time: {activity.time}</p>
                        <p>Location: {activity.location}</p>
                        <p>Price: {convertedPrice} {selectedCurrency}</p>
                        <p>Rating: {renderStars(activity.averageRating)}</p>
                        {activity.specialDiscount && (
                            <p>Discount: {activity.specialDiscount}</p>
                        )}

                        {activity.tags && activity.tags.length > 0 && (
                            <p>Tags: {activity.tags.map((tag) => tag.name).join(", ")}</p>
                        )}

                        {activity.category && activity.category.length > 0 && (
                            <p>Category: {activity.category.map((cat) => cat.type).join(", ")}</p>
                        )}
                        <p style={{color: activity.bookingOpen ? "green" : "red"}}>
                          {activity.bookingOpen ? "Booking: Open" : "Booking: Closed"}
                        </p>
                        <div className={styles.buttonContainers}>
                          <button
                              onClick={() => navigator.clipboard.writeText(`${window.location.origin}/UpcomingActivities/${activity._id}`)}
                              className={styles.cardButton} >
                            Copy link
                          </button>
                          <button onClick={() => handleUpcomingActivitiesDetails(activity._id)}
                                  className={styles.cardButton} >
                            Details
                          </button>
                          <button
                              onClick={() => window.location.href = `mailto:?subject=Check out this historical place&body=${window.location.origin}/UpcomingActivities/${activity._id}`}
                              className={styles.cardButton} >
                            Email
                          </button>
                          {userId && (
                        <button onClick={() => handleActivityBook(activity._id)} className={styles.cardButton}>
                          Book
                        </button>
                      )}
                      
            {userRole === "Tourist" && (
                            <button 
                            onClick={() => handleAddActivity(activity)} 
                            className={styles.cardButton}
                          >
                            Save
                          </button>
                        )}
                        </div>

                        <div className={styles.mapContainer}>
                          <MapContainer center={[activity.coordinates.lat || 51.505, activity.coordinates.lng || -0.09]}
                                        zoom={13} style={{height: "100%", width: "100%"}}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                            {activity.coordinates.lat && activity.coordinates.lng && (
                                <Marker position={[activity.coordinates.lat, activity.coordinates.lng]}/>
                            )}
                          </MapContainer>
                        </div>

                        {/* Admin-only Checkbox */}
                        {userRole === "Admin" && (
                            <div className={styles.adminCheckbox}>
                              <label>
                                <input
                                    type="checkbox"
                                    checked={activity.archived}
                                    onChange={(e) => handleArchiveToggle(activity._id, e.target.checked)}
                                />
                                Flag (inappropriate)
                              </label>
                            </div>
                        )}
                      </div>
                  );
                })
            )}
          </section>
        </main>
        {isBookingModalOpen && (
        <MyBookingModal
          userId={userId}
          isOpen={isBookingModalOpen}
          onRequestClose={closeBookingModal}
          bookingType="activity"
          bookingId={selectedActivityId}
        />
      )}
        <Footer />
      </div>
  );
};

export default UpcomingActivities;