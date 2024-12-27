import React, { useEffect, useState } from "react";
import styles from "./UpcomingItinerary.module.css";
import Footer from "/src/client/components/Footer/Footer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Header from "/src/client/Components/Header/Header";
import axios from "axios";
import MyBookingModal from "/src/client/Components/Booking/MyBookingModal";
import { Rating } from "@mui/material";

const UpcomingItineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("date");
  const [budget, setBudget] = useState(0);
  const [date, setDate] = useState("");
  const [preferences, setPreferences] = useState([]);
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(true);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("EGP");
  const [exchangeRates, setExchangeRates] = useState({});
  const [currencyCodes, setCurrencyCodes] = useState([]);
  const location = useLocation();
  const touristId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(0);
  const [walletCurrency, setWalletCurrency] = useState('EGP');
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    role: "",
    image: "",
  });

  const { userId } = location.state || {};
  const [userRole, setUserRole] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedItineraryId, setSelectedItineraryId] = useState(null);

  const fetchUserRole = async () => {
    try {
      // Replace `userId` with the actual user ID if available
      const response = await axios.get(`/tourist/${userId}`);
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

  const convertPrice = (price, fromCurrency, toCurrency) => {
    if (price == null) {
      return "N/A";
    }
    const rateFrom = exchangeRates[fromCurrency] || 1;
    const rateTo = exchangeRates[toCurrency] || 1;
    return ((price / rateFrom) * rateTo).toFixed(2);
  };
  const GoToMyItineraries  = () => {
    navigate("/MyItineraries", { state: { userId } });
  };


const handleArchiveToggle = async (ItineraryId, isArchived) => {
  try {
    setItineraries(
      itineraries.map((itinerary) =>
        itinerary._id === ItineraryId
          ? { ...itinerary, archived: isArchived }
          : itinerary
      )
    );

    await axios.put(`/tourguide/edit-itineraries/${ItineraryId}`, {
      archived: isArchived,
    });

    if (isArchived) {
      const itinerary = itineraries.find(itinerary => itinerary._id === ItineraryId);
      const response = await axios.get(`/tourist/${itinerary.createdby}`);
      const creatorEmail = response.data.email;
      const creatorId = response.data._id;

      await axios.post('/email/send-itinerary-archived-email', {
        email: creatorEmail,
        name: itinerary.name
      });

      console.log("Email sent to the creator");

      // Send a notification to the creator
      const title = `Your itinerary "${itinerary.name}" has been archived`;
      const message = `The itinerary "${itinerary.name}" has been archived.`;
      await axios.post('/notification/create', {
        title,
        message,
        userId: creatorId
      });
      console.log("Notification sent to the creator");
    }
  } catch (error) {
    console.error("Error updating archived status:", error);
    setItineraries(
      itineraries.map((itinerary) =>
        itinerary._id === ItineraryId
          ? { ...itinerary, archived: !isArchived }
          : itinerary
      )
    );
  }
};

  const fetchTags = async () => {
    try {
      const response = await fetch("/tourguide/get-tags");
      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }
      const data = await response.json();
      setAvailableTags(data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const fetchFilteredItineraries = async (whichResponse) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        sortBy: sortCriteria === "averageRating" ? "averageRating:desc" : `${sortCriteria}:asc`,
        price: budget,
        date: date,
        tags: preferences.join(","),
        language: language,
      }).toString();

      // First, fetch the user's preference tags
      const userResponse = await axios.get(`/tourist/${userId}`);
      const userPreferenceTags = userResponse.data.preferencestags || [];

      let response;
      if (whichResponse) {
        response = await fetch(
          `/guest/get-itineraries-sorted?${queryParams}`
        );
      } else {
        response = await fetch(
          `/guest/filter-itineraries?${queryParams}`
        );
      }

      if (!response.ok) {
        throw new Error("Failed to fetch itineraries");
      }
      let data = await response.json();

      // Filter out archived itineraries for non-admin/non-tourguide users
      if (userRole !== "TourGuide" && userRole !== "Admin") {
        data = data.filter((itinerary) => !itinerary.archived);
      }

      // Sort itineraries based on matching preference tags
      data.sort((a, b) => {
        const aMatchCount = a.tags.filter(tag => 
          userPreferenceTags.includes(tag._id)
        ).length;
        
        const bMatchCount = b.tags.filter(tag => 
          userPreferenceTags.includes(tag._id)
        ).length;

        return bMatchCount - aMatchCount; // Sort in descending order of matches
      });

      setItineraries(data);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterClick = async () => await fetchFilteredItineraries(false);

  useEffect(() => {
    fetchExchangeRates();
    fetchUserRole();
    fetchFilteredItineraries(true);
    fetchTags();
  }, [sortCriteria, budget, date, preferences, language, userRole]);

  const handleItineraryBook = (itineraryId) => {
    setSelectedItineraryId(itineraryId);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedItineraryId(null);
  };

  const handleAddItinerary = async (itinerary) => {
    try {
      console.log("User ID:", userId);
  
      // Fetch the current user profile
      const profileResponse = await axios.get(`/tourist/${userId}`);
      const currentItineraries = profileResponse.data.itineraries || [];
  
      // Check if the itinerary is already in the user's itineraries
      if (currentItineraries.includes(itinerary._id)) {
        alert(`The itinerary "${itinerary.title}" is already saved in your activities.`);
        return; // Exit the function early
      }
  
      // Add the itinerary ID to the user's itineraries array
      const updatedItineraries = [...currentItineraries, itinerary._id];
  
      // Update the user's profile with the updated itineraries array
      await axios.put(`/tourist/${userId}`, {
        id: userId,
        itineraries: updatedItineraries,
      });
  
      // Update local state if needed
      alert(`Itinerary "${itinerary.title}" has been successfully added to your activities!`);
    } catch (err) {
      console.error('Error adding itinerary:', err);
      alert('An error occurred while adding the itinerary. Please try again.');
    }
  };
  
  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      <div className="container py-4">
        <div className={styles.pageHeader}>
          <h1>Upcoming Itineraries</h1>
          {/* <p>Discover amazing travel experiences curated just for you</p> */}
        </div>

        {/* Enhanced Filter Section */}
        <div className={styles.filterSection}>
          <div className="row g-4">
            <div className="col-md-3">
              <div className={styles.filterGroup}>
                <div className={styles.filterIcon}>
                  <i className="fas fa-sort"></i>
                </div>
                <label>Sort By</label>
                <select
                  className="form-select"
                  value={sortCriteria}
                  onChange={(e) => setSortCriteria(e.target.value)}
                  style={{backgroundColor: "#2a2a2a", color: "white"}}
                >
                  <option value="date">Date</option>
                  <option value="price">Price</option>
                  <option value="averageRating">Rating</option>
                </select>
              </div>
            </div>

            <div className="col-md-3">
              <div className={styles.filterGroup}>
                <div className={styles.filterIcon}>
                  <i className="fas fa-coins"></i>
                </div>
                <label>Budget</label>
                <input
                  type="number"
                  className="form-control"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Enter maximum budget"
                />
              </div>
            </div>

            <div className="col-md-3">
              <div className={styles.filterGroup}>
                <div className={styles.filterIcon}>
                  <i className="fas fa-calendar"></i>
                </div>
                <label>Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{backgroundColor: "#2a2a2a", color: "white"}}
                />
              </div>
            </div>

            <div className="col-md-3">
              <div className={styles.filterGroup}>
                <div className={styles.filterIcon}>
                  <i className="fas fa-language"></i>
                </div>
                <label>Language</label>
                <input
                  type="text"
                  className="form-control"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="Preferred language"
                  style={{backgroundColor: "#2a2a2a", color: "white"}}
                />
              </div>
            </div>

            <div className="col-md-9">
              <div className={styles.filterGroup}>
                <div className={styles.filterIcon}>
                  <i className="fas fa-tags"></i>
                </div>
                <label>Preferences</label>
                <select
                  className="form-select"
                  multiple
                  value={preferences}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions).map(
                      (option) => option.value
                    );
                    setPreferences(selectedOptions);
                  }}
                >
                  {availableTags.map((tag) => (
                    <option key={tag._id} value={tag.name}>
                      {tag.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-md-3">
              <div className={styles.filterGroup}>
                <div className={styles.filterIcon}>
                  <i className="fas fa-money-bill-wave"></i>
                </div>
                <label>Currency</label>
                <select
                  className="form-select"
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  style={{backgroundColor: "#2a2a2a", color: "white"}}
                >
                  {currencyCodes.map((code) => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-12">
              <button 
                onClick={handleFilterClick}
                className={styles.filterButton}
              >
                <i className="fas fa-filter me-2"></i>
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Itineraries Grid */}
        <div className="row g-4 mt-4">
          {loading ? (
            <div className={styles.loadingContainer}>
              <CircularProgress />
              <p>Loading amazing itineraries...</p>
            </div>
          ) : itineraries.length === 0 ? (
            <div className={styles.noResults}>
              <i className="fas fa-search fa-3x mb-3"></i>
              <h3>No itineraries found</h3>
              <p>Try adjusting your filters for more results</p>
            </div>
          ) : (
            itineraries.map((itinerary) => (
              <div className="col-lg-6 col-xl-4" key={itinerary._id}>
                <div className={styles.placeCard}>
                  <div className={styles.cardHeader}>
                    <h3>{itinerary.name}</h3>
                    <Rating 
                      value={Math.round(itinerary.averageRating * 2) / 2} 
                      precision={0.5} 
                      readOnly 
                      className={styles.rating}
                    />
                  </div>

                  <div className={styles.cardContent}>
                    <div className={styles.mainInfo}>
                      <div className={styles.infoItem}>
                        <i className="fas fa-clock"></i>
                        <span>{itinerary.duration} hours</span>
                      </div>
                      <div className={styles.infoItem}>
                        <i className="fas fa-language"></i>
                        <span>{itinerary.language}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <i className="fas fa-tag"></i>
                        <span>{convertPrice(itinerary.price, itinerary.currency, selectedCurrency)} {selectedCurrency}</span>
                      </div>
                    </div>

                    <div className={styles.detailsAccordion}>
                      <div className={styles.accordionItem}>
                        <h4>
                          <i className="fas fa-calendar-alt me-2"></i>
                          Available Dates & Times
                        </h4>
                        <div className={styles.dates}>
                          {itinerary.availableDates.join(", ")}
                        </div>
                        <div className={styles.times}>
                          {itinerary.availableTimes.join(", ")}
                        </div>
                      </div>

                      <div className={styles.accordionItem}>
                        <h4>
                          <i className="fas fa-map-marker-alt me-2"></i>
                          Locations
                        </h4>
                        <p><strong>Pickup:</strong> {itinerary.pickupLocation}</p>
                        <p><strong>Dropoff:</strong> {itinerary.dropoffLocation}</p>
                      </div>

                      {itinerary.activities && itinerary.activities.length > 0 && (
                        <div className={styles.accordionItem}>
                          <h4>
                            <i className="fas fa-list-alt me-2"></i>
                            Activities
                          </h4>
                          <ul className={styles.activitiesList}>
                            {itinerary.activities.map((activity) => (
                              <li key={activity._id}>
                                <div className={styles.activityHeader}>
                                  <span>{activity.location}</span>
                                  <span className={styles.activityTime}>
                                    {activity.date} at {activity.time}
                                  </span>
                                </div>
                                {(activity.specialDiscount || activity.price) && (
                                  <div className={styles.activityPricing}>
                                    {activity.specialDiscount && (
                                      <span className={styles.discount}>
                                        {activity.specialDiscount} OFF
                                      </span>
                                    )}
                                    {activity.price && (
                                      <span className={styles.price}>
                                        {activity.price}$
                                      </span>
                                    )}
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {itinerary.tags && itinerary.tags.length > 0 && (
                        <div className={styles.tags}>
                          {itinerary.tags.map((tag) => (
                            <span key={tag._id} className={styles.tag}>
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className={styles.cardActions}>
                      {userRole === "Admin" && (
                        <div className={styles.adminControl}>
                          <label className={styles.flagLabel}>
                            <input
                              type="checkbox"
                              checked={itinerary.archived}
                              onChange={(e) => handleArchiveToggle(itinerary._id, e.target.checked)}
                            />
                            <span>Flag as inappropriate</span>
                          </label>
                        </div>
                      )}
                      
                      <div className={styles.actionButtons}>
                        {userId && (
                          <button 
                            onClick={() => handleItineraryBook(itinerary._id)}
                            className={styles.bookButton}
                          >
                            <i className="fas fa-bookmark me-2"></i>
                            Book Now
                          </button>
                        )}
                        
                        {userRole === "Tourist" && (
                          <button 
                            onClick={() => handleAddItinerary(itinerary)}
                            className={styles.saveButton}
                          >
                            <i className="fas fa-heart me-2"></i>
                            Save
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />

      {isBookingModalOpen && (
        <MyBookingModal
          userId={userId}
          isOpen={isBookingModalOpen}
          onRequestClose={closeBookingModal}
          bookingType="itinerary"
          bookingId={selectedItineraryId}
        />
      )}
    </div>
  );
};

export default UpcomingItineraries;