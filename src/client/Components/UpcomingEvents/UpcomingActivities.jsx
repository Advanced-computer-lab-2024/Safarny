import React, { useEffect, useState } from "react";
import styles from "./UpcomingActivities.module.css";
// import Logo from "/src/client/Assets/Img/logo.png";
import Footer from "/src/client/components/Footer/Footer";
import Header from "/src/client/components/Header/Header";
import {Link, useNavigate} from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

const UpcomingActivities = () => {
  const [activities, setActivities] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("date"); // Default sorting by date
  const [filterCriteria, setFilterCriteria] = useState(""); // Filter criteria state
  const [budget, setBudget] = useState([0, 0]); // Budget range state
  const [dateRange, setDateRange] = useState(""); // Date range state
  const [selectedCategories, setSelectedCategories] = useState([]); // Selected categories state
  const [availableCategories, setAvailableCategories] = useState([]); // All available categories
  const [selectedCurrency, setSelectedCurrency] = useState('EGP'); // Define selectedCurrency state
  const [rating, setRating] = useState(0); // Rating filter state
  const navigate = useNavigate();

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

  // Fetch activities based on sorting and filtering criteria
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        let url = `http://localhost:3000/guest/get-activities-sorted?sortBy=${sortCriteria}:asc`;

        // Add filter conditions
        if (filterCriteria === "budget") {
          url = `http://localhost:3000/guest/filter-activities?minBudget=${budget[0]}&maxBudget=${budget[1]}`;
        } else if (filterCriteria === "date") {
          url = `http://localhost:3000/guest/filter-activities?&date=${dateRange}`;
        } else if (
          filterCriteria === "category" &&
          selectedCategories.length > 0
        ) {
          url = `http://localhost:3000/guest/filter-activities?&category=${selectedCategories.join(
            ","
          )}`;
        } else if (filterCriteria === "rating") {
          url = `http://localhost:3000/guest/filter-activities?&rating=${rating}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch activities");
        }
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, [sortCriteria, filterCriteria, budget, dateRange, selectedCategories, rating]);

  // Fetch available categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/advertiser/GetCategories"
        );
        const categories = await response.json();
        setAvailableCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Handle category checkbox change
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };
  const handleUpcomingActivitiesDetails = (activityId) => {
    navigate(`/UpcomingActivities/${activityId}`); // Redirect to details page
  }
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <h2>Upcoming Activities</h2>

        {/* Sorting options */}
        <div className={styles.sortOptions}>
          <button onClick={() => setSortCriteria("date")} className={styles.viewButton}
                  style={{margin: '2px'}}>Sort by Date
          </button>
          <button onClick={() => setSortCriteria("price")}
                  style={{margin: '2px'}}>
            Sort by Price
          </button>
          <button onClick={() => setSortCriteria("rating")}
                  style={{margin: '2px'}}>
            Sort by Rating
          </button>
        </div>

        {/* Filter options */}
        <div className={styles.filterOptions}>
          <label htmlFor="filter">Filter by: </label>
          <select
              id="filter"
              onChange={(e) => setFilterCriteria(e.target.value)}
          >
            <option value="">None</option>
            <option value="budget">Budget</option>
            <option value="date">Date</option>
            <option value="category">Category</option>
            <option value="rating">Rating</option>
          </select>
        </div>
        <div className={styles.currencySelector}>
          <FormControl fullWidth margin="normal">
            <InputLabel><h4>Currency</h4></InputLabel>
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
        {/* Conditional input for filtering */}
        {filterCriteria === "budget" && (
            <div className={styles.filterInput}>
              <label>
                Budget range: {budget[0]}$ - {budget[1]}$
              </label>
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
        )}

        {filterCriteria === "date" && (
            <div className={styles.filterInput}>
              <label>Select Date Range: </label>
              <input type="date" onChange={(e) => setDateRange(e.target.value)}/>
            </div>
        )}

        {filterCriteria === "category" && availableCategories.length > 0 && (
            <div className={styles.filterInput}>
              <label>Select Categories:</label>
              {availableCategories.map((category) => (
                  <div key={category._id}>
                    <input
                        type="checkbox"
                        value={category.type}
                        onChange={() => handleCategoryChange(category.type)}
                    />
                    {category.type}
                  </div>
              ))}
            </div>
        )}

        {filterCriteria === "rating" && (
            <div className={styles.filterInput}>
              <label>Rating: {rating} </label>
              <input
                  type="range"
                  min="0"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
              />
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
                      <p>Rating: {activity.rating}&#9733;</p>

                      {activity.specialDiscount && (
                          <p>Discount: {activity.specialDiscount}</p>
                      )}

                      {/* Display Tags */}
                      {activity.tags && activity.tags.length > 0 && (
                          <p>Tags: {activity.tags.map((tag) => tag.name).join(", ")}</p>
                      )}

                      {/* Display Categories */}
                      {activity.category && activity.category.length > 0 && (
                          <p>
                            Category:{" "}
                            {activity.category.map((cat) => cat.type).join(", ")}
                          </p>
                      )}
                      <p style={{color: activity.bookingOpen ? "green" : "red"}}>
                        {activity.bookingOpen ? "Booking: Open" : "Booking: Closed"}
                      </p>
                      <p>
                        <button
                            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/UpcomingActivities/${activity._id}`)}
                            className={styles.copyButton}
                            style={{margin: '2px'}}
                        >
                          Copy link
                        </button>
                        <button onClick={() => handleUpcomingActivitiesDetails(activity._id)}
                                className={styles.viewButton}
                                style={{margin: '2px'}}
                        >
                          View Details
                        </button>
                        <button
                            onClick={() => window.location.href = `mailto:?subject=Check out this historical place&body=${window.location.origin}/UpcomingActivities/${activity._id}`}
                            className={styles.emailButton}
                            style={{margin: '2px'}}
                        >
                          Email
                        </button>
                      </p>

                      {/* Map Container */}
                      <div className={styles.mapContainer}>
                        <MapContainer
                            center={[
                              activity.coordinates.lat || 51.505,
                              activity.coordinates.lng || -0.09,
                            ]}
                            zoom={13}
                            style={{height: "100%", width: "100%"}}
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

                          {activity.coordinates.lat && activity.coordinates.lng && (
                              <Marker
                                  position={[
                                    activity.coordinates.lat,
                                    activity.coordinates.lng,
                                  ]}
                              />
                          )}
                        </MapContainer>
                      </div>
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

export default UpcomingActivities;
