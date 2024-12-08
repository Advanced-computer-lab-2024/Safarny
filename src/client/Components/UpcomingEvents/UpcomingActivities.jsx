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
  const touristId = userId || localStorage.getItem("userId");
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
  const [error, setError] = useState(null);

  // Method to fetch user role
  const fetchUserRole = async () => {
    if (!touristId) {
      console.log('No tourist ID available');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/tourist/${touristId}`);
      const user = response.data;
      setUserRole(user.role);
      setWallet(user.wallet);
      setWalletCurrency(user.walletcurrency || 'EGP');
      setSelectedCurrency(user.walletcurrency || 'EGP');
      console.log('User role fetched:', user.role);
    } catch (err) {
      console.error('Error fetching user role:', err);
      setError('Error fetching user data');
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
      console.log("id", touristId);
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
        console.log('Fetching activities for user:', touristId);
        
        // First, fetch the user's preference tags
        let userPreferenceTags = [];
        if (touristId) {
          const userResponse = await axios.get(`http://localhost:3000/tourist/${touristId}`);
          userPreferenceTags = userResponse.data.preferencestags || [];
        }

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

        console.log('Fetching from URL:', url);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Activities fetched:', data.length);
        
        setActivities(data);
      } catch (error) {
        console.error("Error fetching activities:", error);
        setError("Failed to load activities");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [touristId, sortCriteria, filterCriteria, budget, dateRange, selectedCategories]);

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
      alert(`Activity at "${activity.location}" has been successfully added to your activities!`);
    } catch (err) {
      console.error('Error adding activity:', err);
      alert('An error occurred while adding the activity. Please try again.');
    }
  };
  
  
  
  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      <div className="container py-4">
        <div className={styles.pageHeader}>
          <h1>Upcoming Activities</h1>
          {/* <p>Discover exciting activities and experiences</p> */}
        </div>

        <div className={styles.controlPanel}>
          {/* Sort Options */}
          <div className={styles.sortSection}>
            <h4><i className="fas fa-sort me-2"></i>Sort By</h4>
            <div className={styles.buttonGroup}>
              <button onClick={() => setSortCriteria("date")} className={styles.controlButton}>
                <i className="fas fa-calendar me-2"></i>Date
              </button>
              <button onClick={() => setSortCriteria("price")} className={styles.controlButton}>
                <i className="fas fa-tag me-2"></i>Price
              </button>
              <button onClick={() => setSortCriteria("averageRating")} className={styles.controlButton}>
                <i className="fas fa-star me-2"></i>Rating
              </button>
            </div>
          </div>

          {/* Navigation Button */}
          <div className={styles.navigationSection}>
            <button onClick={GoToMyActivities} className={styles.primaryButton}>
              <i className="fas fa-bookmark me-2"></i>My Activities
            </button>
          </div>

          {/* Filter Section */}
          <div className={styles.filterSection}>
            <div className="row g-4">
              <div className="col-md-4">
                <div className={styles.filterGroup}>
                  <div className={styles.filterIcon}>
                    <i className="fas fa-filter"></i>
                  </div>
                  <label>Filter by</label>
                  <select 
                    onChange={(e) => setFilterCriteria(e.target.value)} 
                    className="form-select"
                  >
                    <option value="">None</option>
                    <option value="budget">Budget</option>
                    <option value="date">Date</option>
                    <option value="category">Category</option>
                    <option value="averageRating">Rating</option>
                  </select>
                </div>
              </div>

              <div className="col-md-4">
                <div className={styles.filterGroup}>
                  <div className={styles.filterIcon}>
                    <i className="fas fa-coins"></i>
                  </div>
                  <label>Currency</label>
                  <Select 
                    value={selectedCurrency} 
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className={styles.currencySelect}
                  >
                    {currencyCodes.map(code => (
                      <MenuItem key={code} value={code}>{code}</MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            {/* Dynamic Filter Inputs */}
            {filterCriteria && (
              <div className={`${styles.filterInputs} mt-4`}>
                {filterCriteria === "budget" && (
                  <div className={styles.rangeFilter}>
                    <label>Budget range: {budget[0]}$ - {budget[1]}$</label>
                    <div className={styles.rangeInputs}>
                      <input 
                        type="range" 
                        min="0" 
                        max="1000" 
                        value={budget[0]} 
                        onChange={(e) => setBudget([+e.target.value, budget[1]])} 
                      />
                      <input 
                        type="range" 
                        min="0" 
                        max="1000" 
                        value={budget[1]} 
                        onChange={(e) => setBudget([budget[0], +e.target.value])} 
                      />
                    </div>
                  </div>
                )}

                {filterCriteria === "date" && (
                  <div className={styles.dateFilter}>
                    <label>Select Date Range</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      onChange={(e) => setDateRange(e.target.value)} 
                    />
                  </div>
                )}

                {filterCriteria === "category" && (
                  <div className={styles.categoryFilter}>
                    <label>Categories</label>
                    <div className={styles.categoryGrid}>
                      {availableCategories.map((category) => (
                        <div key={category._id} className={styles.categoryOption}>
                          <input 
                            type="checkbox" 
                            id={category.type}
                            value={category.type} 
                            onChange={() => handleCategoryChange(category.type)} 
                          />
                          <label htmlFor={category.type}>{category.type}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filterCriteria === "averageRating" && (
                  <div className={styles.ratingFilter}>
                    <label>Minimum Rating: {averageRating}</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="5" 
                      value={averageRating} 
                      onChange={(e) => setAverageRating(e.target.value)} 
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Activities Grid */}
        <div className="row g-4 mt-4">
          {loading ? (
            <div className="col-12 text-center">
              <CircularProgress />
              <p>Loading activities...</p>
            </div>
          ) : error ? (
            <div className="col-12">
              <div className={styles.errorMessage}>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>
                  Try Again
                </button>
              </div>
            </div>
          ) : activities.length === 0 ? (
            <div className="col-12">
              <div className={styles.noResults}>
                <i className="fas fa-search me-2"></i>
                No activities found
              </div>
            </div>
          ) : (
            activities.map((activity) => {
              const convertedPrice = convertPrice(activity.price, activity.currency, selectedCurrency);
              return (
                <div className="col-lg-6 col-xl-4" key={activity._id}>
                  <div className={styles.activityCard}>
                    <div className={styles.cardHeader}>
                      <h3>{activity.name}</h3>
                      <div className={styles.rating}>
                        {renderStars(activity.averageRating)}
                      </div>
                    </div>

                    <div className={styles.cardBody}>
                      <div className={styles.mainInfo}>
                        <div className={styles.infoItem}>
                          <i className="fas fa-calendar me-2"></i>
                          <span>{new Date(activity.date).toLocaleDateString()}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <i className="fas fa-clock me-2"></i>
                          <span>{activity.time}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <i className="fas fa-map-marker-alt me-2"></i>
                          <span>{activity.location}</span>
                        </div>
                      </div>

                      <div className={styles.priceSection}>
                        <div className={styles.price}>
                          <strong>{convertedPrice} {selectedCurrency}</strong>
                          {activity.specialDiscount && (
                            <span className={styles.discount}>
                              {activity.specialDiscount} OFF
                            </span>
                          )}
                        </div>
                        <div className={styles.bookingStatus} data-status={activity.bookingOpen}>
                          {activity.bookingOpen ? "Booking Open" : "Booking Closed"}
                        </div>
                      </div>

                      {(activity.tags || activity.category) && (
                        <div className={styles.tags}>
                          {activity.tags && activity.tags.map((tag) => (
                            <span key={tag._id} className={styles.tag}>
                              {tag.name}
                            </span>
                          ))}
                          {activity.category && activity.category.map((cat) => (
                            <span key={cat._id} className={`${styles.tag} ${styles.categoryTag}`}>
                              {cat.type}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className={styles.mapWrapper}>
                        <MapContainer 
                          center={[activity.coordinates.lat || 51.505, activity.coordinates.lng || -0.09]}
                          zoom={13} 
                          className={styles.map}
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                          {activity.coordinates.lat && activity.coordinates.lng && (
                            <Marker position={[activity.coordinates.lat, activity.coordinates.lng]}/>
                          )}
                        </MapContainer>
                      </div>

                      <div className={styles.cardActions}>
                        <div className={styles.shareActions}>
                          <button
                            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/UpcomingActivities/${activity._id}`)}
                            className={styles.iconButton}
                            title="Copy Link"
                          >
                            Copy Link
                            <i className="fas fa-link"></i>
                          </button>
                          <button
                            onClick={() => window.location.href = `mailto:?subject=Check out this activity&body=${window.location.origin}/UpcomingActivities/${activity._id}`}
                            className={styles.iconButton}
                            title="Share via Email"
                          >
                            Share via Email
                            <i className="fas fa-envelope"></i>
                          </button>
                        </div>

                        <div className={styles.mainActions}>
                          {userId && (
                            <button 
                              onClick={() => handleActivityBook(activity._id)}
                              className={styles.bookButton}
                              disabled={!activity.bookingOpen}
                            >
                              <i className="fas fa-ticket-alt me-2"></i>
                              Book Now
                            </button>
                          )}
                          
                          {userRole === "Tourist" && (
                            <button 
                              onClick={() => handleAddActivity(activity)}
                              className={styles.saveButton}
                            >
                              <i className="fas fa-heart me-2"></i>
                              Save
                            </button>
                          )}
                        </div>
                      </div>

                      {userRole === "Admin" && (
                        <div className={styles.adminControl}>
                          <label className={styles.flagLabel}>
                            <input
                              type="checkbox"
                              checked={activity.archived}
                              onChange={(e) => handleArchiveToggle(activity._id, e.target.checked)}
                            />
                            <span>Flag as inappropriate</span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <Footer />

      {isBookingModalOpen && (
        <MyBookingModal
          userId={userId}
          isOpen={isBookingModalOpen}
          onRequestClose={closeBookingModal}
          bookingType="activity"
          bookingId={selectedActivityId}
        />
      )}
    </div>
  );
};

export default UpcomingActivities;