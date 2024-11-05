import React, { useEffect, useState } from "react";
import styles from "./UpcomingItinerary.module.css";
import Logo from "/src/client/Assets/Img/logo.png";
import Footer from "/src/client/components/Footer/Footer";
import { Link } from "react-router-dom";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import Header from "/src/client/Components/Header/Header";

const UpcomingItineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("date");
  const [budget, setBudget] = useState(0);
  const [date, setDate] = useState("");
  const [preferences, setPreferences] = useState([]);
  const [language, setLanguage] = useState("");
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('EGP'); // Define selectedCurrency state

  const conversionRates = {
    USD: 1 / 48.72,
    SAR: 1 / 12.97,
    GBP: 1 / 63.02,
    EUR: 1 / 53.02,
    EGP: 1, // EGP to EGP is 1:1
  };

  const convertPrice = (price, fromCurrency, toCurrency) => {
    const rateFrom = conversionRates[fromCurrency];
    const rateTo = conversionRates[toCurrency];
    return ((price / rateFrom) * rateTo).toFixed(2); // Convert and format to 2 decimal places
  };
  useEffect(() => {
    fetchFilteredItineraries(true);
    fetchTags();
  }, [sortCriteria]);

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
      setItineraries(data);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
    }
  };

  return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <h2>Upcoming Itineraries</h2>

          {/* Sorting options */}
          <div className={styles.sortOptions}>
            <button onClick={() => setSortCriteria("date")}>Sort by Date</button>
            <button onClick={() => setSortCriteria("price")}>
              Sort by Price
            </button>
            <button onClick={() => setSortCriteria("duration")}>
              Sort by Duration
            </button>
            <button onClick={() => setSortCriteria("rating")}>
              Sort by Rating
            </button>
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
            <div className={styles.currencySelector}>
              <FormControl fullWidth margin="normal">
                <InputLabel><h3>Currency</h3></InputLabel>
                <br></br>
                <Select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                >
                  <MenuItem value="EGP">EGP</MenuItem>
                  <MenuItem value="SAR">SAR</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
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
                      </div>
                  );
                })
            )}
          </section>
        </main>
        <Footer/>
      </div>
  );
};

export default UpcomingItineraries;
