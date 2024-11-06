import React, { useEffect, useState } from "react";
import styles from "./UpcomingItinerary.module.css";
import Logo from "/src/client/Assets/Img/logo.png";
import Footer from "/src/client/components/Footer/Footer";
import { Link ,useLocation, useNavigate} from "react-router-dom";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import Header from "/src/client/Components/Header/Header";
import axios from 'axios';


const UpcomingItineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("date");
  const [budget, setBudget] = useState(0);
  const [date, setDate] = useState("");
  const [preferences, setPreferences] = useState([]);
  const [language, setLanguage] = useState("");
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('EGP');
  const [exchangeRates, setExchangeRates] = useState({});
  const [currencyCodes, setCurrencyCodes] = useState([]);
  const location = useLocation();
  const touristId = localStorage.getItem('userId');
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    role: "",
    image: "", // Added image field
  });


  const { userId } = location.state || {};
  //const userId = localStorage.getItem('userId');

  const [userRole, setUserRole] = useState(""); // State for storing user role

  


  const fetchExchangeRates = async () => {
    try {
      const response = await fetch('https://v6.exchangerate-api.com/v6/033795aceeb35bc666391ed5/latest/EGP');
      const data = await response.json();
      setExchangeRates(data.conversion_rates);
      setCurrencyCodes(Object.keys(data.conversion_rates));
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    }
  };
  const convertPrice = (price, fromCurrency, toCurrency) => {
    const rateFrom = exchangeRates[fromCurrency];
    const rateTo = exchangeRates[toCurrency];
    return ((price / rateFrom) * rateTo).toFixed(2);
  };
  const handleArchiveToggle = async (ItineraryId, isArchived) => {
    try {
      // Update the local state first
      setItineraries(itineraries.map(itinerary => 
        itinerary._id === ItineraryId ? { ...itinerary, archived: isArchived } : itinerary
      ));
      console.log("Local state updated");
  
      // Make a request to the server to update the archived status
      await axios.put(`/tourguide/edit-itineraries/${ItineraryId}`, { archived: isArchived });
      
      console.log("Archived status updated successfully");
      
  
    } catch (error) {
      console.error("Error updating archived status:", error);
      // Optionally, revert the local state if the API call fails
      setItineraries(itineraries.map(itinerary => 
        itinerary._id === itinerary ? { ...itinerary, archived: !isArchived } : itinerary
      ));
    }
  };
  
// Fetch user role
const fetchUserRole = async () => {
  try {
    const response = await axios.get(`/tourist/${userId}`);
    setUserRole(response.data.role); // Adjust based on your backend response
    console.log(response.data.role);
  } catch (error) {
    console.error("Error fetching user role:", error);
  }
};
  useEffect(() => {
    fetchExchangeRates();
    fetchUserRole();
  }, []);

  
  
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

  const handleFilterClick = async () => await fetchFilteredItineraries(false);

  
  useEffect(() => {
    const fetchFilteredItineraries = async (whichResponse) => {
      try {
        const queryParams = new URLSearchParams({
          sortBy: `${sortCriteria}:asc`,
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
    
        // Check if userRole is Tourist and filter accordingly
        if (userRole !== 'TourGuide' && userRole !== 'Admin') {
          const filteredItineraries = data.filter(itinerary => !itinerary.archived);
          setItineraries(filteredItineraries);
        } else {
          setItineraries(data);
        }
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    };
  
    // Call fetch with true or false depending on requirement
    fetchFilteredItineraries(true);
    fetchTags();
    
    // Ensure dependencies include userRole and any variables affecting filtering
  }, [sortCriteria, budget, date, preferences, language, userRole]);
  

  return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <h2>Upcoming Itineraries</h2>

          {/* Sorting options */}
          <div className={styles.sortOptions}>
            <button onClick={() => setSortCriteria("date")}>Sort by Date</button>
            <button onClick={() => setSortCriteria("price")}>Sort by Price</button>
            <button onClick={() => setSortCriteria("duration")}>Sort by Duration</button>
            <button onClick={() => setSortCriteria("rating")}>Sort by Rating</button>
          </div>

          {/* Filter options */}
          <div className={styles.filterOptions}>
            {/* Budget Filter */}
            <div className={styles.filterGroup}>
              <label>Budget: </label>
              <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Budget"
              />
            </div>

            {/* Date Filter */}
            <div className={styles.filterGroup}>
              <label>Date: </label>
              <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* Preferences Filter - dynamically populated from API */}
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

            {/* Language Filter */}
            <div className={styles.filterGroup}>
              <label>Language: </label>
              <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="Language"
              />
            </div>

            {/* Currency Selector */}
            <div className={styles.currencySelector}>
              <FormControl fullWidth margin="normal">
                <InputLabel><h3>Currency</h3></InputLabel>
                <br></br>
                <Select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                >
                  {currencyCodes.map(code => (
                      <MenuItem key={code} value={code}>{code}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Apply Filters Button */}
            <button onClick={handleFilterClick}>Apply Filters</button>
          </div>

          {/* Itinerary List */}
          <section className={styles.itineraryList}>
            {itineraries.length === 0 ? (
                <p>No upcoming itineraries found.</p>
            ) : (
                itineraries.map((itinerary) => {
                  const convertedPrice = convertPrice(itinerary.price, itinerary.currency, selectedCurrency);
                  return (
                      <div key={itinerary._id} className={styles.itineraryItem}>
                        <h3>{itinerary.name}</h3>
                        <p>Duration: {itinerary.duration} hours</p>
                        <p>Language: {itinerary.language}</p>
                        <p>Price: {convertedPrice} {selectedCurrency}</p>
                        <p>Available Dates: {itinerary.availableDates.join(", ")}</p>
                        <p>Available Times: {itinerary.availableTimes.join(", ")}</p>
                        <p>Accessibility: {itinerary.accessibility ? "Yes" : "No"}</p>
                        <p>Pickup Location: {itinerary.pickupLocation}</p>
                        <p>Dropoff Location: {itinerary.dropoffLocation}</p>

                        {/* Display Rating */}
                        <p>
                          Rating:{" "}
                          {itinerary.rating !== undefined
                              ? itinerary.rating
                              : "No rating available"}
                        </p>

                        {/* Display Tags */}
                        {itinerary.tags && itinerary.tags.length > 0 && (
                            <p>
                              Tags: {itinerary.tags.map((tag) => tag.name).join(", ")}
                            </p>
                        )}

                        {/* Display Activities */}
                        {itinerary.activities && itinerary.activities.length > 0 && (
                            <div>
                              <p>Activities:</p>
                              <ul>
                                {itinerary.activities.map((activity) => (
                                    <li key={activity._id}>
                                      {activity.location} - {activity.date} at{" "}
                                      {activity.time}
                                      {activity.specialDiscount && (
                                          <span> - Discount: {activity.specialDiscount}</span>
                                      )}
                                      {activity.price && (
                                          <span> - Price: {activity.price}$</span>
                                      )}
                                    </li>
                                ))}
                              </ul>
                            </div>
                        )}
                        {/* Admin-only Checkbox */}
                        {userRole === "Admin" && (
                            <div className={styles.adminCheckbox}>
                            <label>
                             <input
                              type="checkbox"
                            checked={itinerary.archived}
                         onChange={(e) => handleArchiveToggle(itinerary._id, e.target.checked)}
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
        <Footer />
      </div>
  );
};

export default UpcomingItineraries;