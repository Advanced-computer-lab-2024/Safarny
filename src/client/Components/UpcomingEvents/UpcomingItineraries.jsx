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

  const renderStars = (averageRating) => {
    if (averageRating == null) return null;
    const stars = [];
    for (let i = 0; i < averageRating; i++) {
      stars.push(<span key={i}>&#9733;</span>);
    }
    return stars;
  };

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_EXCHANGE_API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!data.conversion_rates) {
        throw new Error("Invalid data format");
      }
      setExchangeRates(data.conversion_rates);
      setCurrencyCodes(Object.keys(data.conversion_rates));
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
      setExchangeRates({ EGP: 1 });
      setCurrencyCodes(["EGP"]);
    }
  };

  const convertPrice = (price, fromCurrency, toCurrency) => {
    if (price == null) {
      return "N/A";
    }
    const rateFrom = exchangeRates[fromCurrency] || 1;
    const rateTo = exchangeRates[toCurrency] || 1;
    return ((price / rateFrom) * rateTo).toFixed(2);
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
};  const fetchUserRole = async () => {
    try {
      const response = await axios.get(`/tourist/${userId}`);
      setUserRole(response.data.role);
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch("http://localhost:3000/tourguide/get-tags");
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

      let response;
      if (whichResponse) {
        response = await fetch(
            `http://localhost:3000/guest/get-itineraries-sorted?${queryParams}`
        );
      } else {
        response = await fetch(
            `http://localhost:3000/guest/filter-itineraries?${queryParams}`
        );
      }

      if (!response.ok) {
        throw new Error("Failed to fetch itineraries");
      }
      const data = await response.json();

      if (userRole !== "TourGuide" && userRole !== "Admin") {
        const filteredItineraries = data.filter(
            (itinerary) => !itinerary.archived
        );
        setItineraries(filteredItineraries);
      } else {
        setItineraries(data);
      }
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



  return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <h2>Upcoming Itineraries</h2>

          <div className={styles.sortOptions}>
            <button onClick={() => setSortCriteria("date")}>Sort by Date</button>
            <button onClick={() => setSortCriteria("price")}>Sort by Price</button>
            <button onClick={() => setSortCriteria("duration")}>
              Sort by Duration
            </button>
            <button onClick={() => setSortCriteria("averageRating")}>
              Sort by Rating
            </button>
          </div>

          <div className={styles.filterOptions}>
            <div className={styles.filterGroup}>
              <label>Budget: </label>
              <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Budget"
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Date: </label>
              <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Preferences: </label>
              <select
                  multiple
                  value={preferences}
                  onChange={(e) => {
                    const selectedOptions = Array.from(
                        e.target.selectedOptions
                    ).map((option) => option.value);
                    setPreferences(selectedOptions);
                  }}
              >
                {availableTags.length > 0 ? (
                    availableTags.map((tag) => (
                        <option key={tag._id} value={tag.name}>
                          {tag.name}
                        </option>
                    ))
                ) : (
                    <option disabled>Loading tags...</option>
                )}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Language: </label>
              <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="Language"
              />
            </div>

            <div className={styles.currencySelector}>
              <FormControl fullWidth margin="normal">
                <InputLabel>
                  <h3>Currency</h3>
                </InputLabel>
                <br></br>
                <Select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                >
                  {currencyCodes.map((code) => (
                      <MenuItem key={code} value={code}>
                        {code}
                      </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <button onClick={handleFilterClick}>Apply Filters</button>
          </div>

          <section className={styles.itineraryList}>
            {itineraries.length === 0 ? (
                <p>No upcoming itineraries found.</p>
            ) : (
                itineraries.map((itinerary) => {
                  const convertedPrice = convertPrice(
                      itinerary.price,
                      itinerary.currency,
                      selectedCurrency
                  );
                  return (
                      <div key={itinerary._id} className={styles.itineraryItem}>
                        <h3>{itinerary.name}</h3>
                        <p>Duration: {itinerary.duration} hours</p>
                        <p>Language: {itinerary.language}</p>
                        <p>
                          Price: {convertedPrice} {selectedCurrency}
                        </p>
                        <p>Available Dates: {itinerary.availableDates.join(", ")}</p>
                        <p>Available Times: {itinerary.availableTimes.join(", ")}</p>
                        <p>Accessibility: {itinerary.accessibility ? "Yes" : "No"}</p>
                        <p>Pickup Location: {itinerary.pickupLocation}</p>
                        <p>Dropoff Location: {itinerary.dropoffLocation}</p>
                        <p>Rating: <Rating value={Math.round(itinerary.averageRating * 2) / 2} precision={0.5} readOnly /></p>
                        {itinerary.tags && itinerary.tags.length > 0 && (
                            <p>
                              Tags: {itinerary.tags.map((tag) => tag.name).join(", ")}
                            </p>
                        )}
                        {itinerary.activities && itinerary.activities.length > 0 && (
                            <div>
                              <p>Activities:</p>
                              <ul>
                                {itinerary.activities.map((activity) => (
                                    <li key={activity._id}>
                                      {activity.location} - {activity.date} at{" "}
                                      {activity.time}
                                      {activity.specialDiscount && (
                                          <span>
                                {" "}
                                            - Discount: {activity.specialDiscount}
                              </span>
                                      )}
                                      {activity.price && (
                                          <span> - Price: {activity.price}$</span>
                                      )}
                                    </li>
                                ))}
                              </ul>
                            </div>
                        )}
                        {userRole === "Admin" && (
                            <div className={styles.adminCheckbox}>
                              <label>
                                <input
                                    type="checkbox"
                                    checked={itinerary.archived}
                                    onChange={(e) =>
                                        handleArchiveToggle(itinerary._id, e.target.checked)
                                    }
                                />
                                Flag (inappropriate)
                              </label>
                            </div>
                        )}
                        {userId && (
                            <button onClick={() => handleItineraryBook(itinerary._id)}>
                              Book
                            </button>
                        )}
                      </div>
                  );
                })
            )}
          </section>
        </main>
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