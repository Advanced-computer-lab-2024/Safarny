import React, { useEffect, useState } from "react";
import styles from "./UpcomingActivities.module.css";
import Footer from "/src/client/components/Footer/Footer";
import Header from "/src/client/components/Header/Header";
import axios from 'axios';
import { Link, useNavigate , useLocation,} from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

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
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(''); // State for storing user role

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch('https://v6.exchangerate-api.com/v6/033795aceeb35bc666391ed5/latest/EGP');
      const data = await response.json();
      setExchangeRates(data.conversion_rates);
      setCurrencyCodes(Object.keys(data.conversion_rates));
      console.log("id",userId);
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    }
  };
  // Method to fetch user role
  const fetchUserRole = async () => {
    try {
        // Replace `userId` with the actual user ID if available
        const response = await axios.get(`http://localhost:3000/tourist/${userId}`);
        setUserRole(response.data.role); // Store user role in state
        console.log('User role:', response.data.role); // Log user role for debugging
    } catch (err) {
        console.error('Error fetching user role:', err);
    }
};
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

  } catch (error) {
    console.error("Error updating archived status:", error);
    // Optionally, revert the local state if the API call fails
    setActivities(activities.map(activity => 
      activity._id === activity ? { ...activity, archived: !isArchived } : activity
    ));
  }
};

  const convertPrice = (price, fromCurrency, toCurrency) => {
    const rateFrom = exchangeRates[fromCurrency];
    const rateTo = exchangeRates[toCurrency];
    return ((price / rateFrom) * rateTo).toFixed(2);
  };

  useEffect(() => {
    fetchExchangeRates();
    fetchUserRole(); // Call to fetch user role
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        let url = `http://localhost:3000/guest/get-activities-sorted?sortBy=${sortCriteria}:asc`;

        if (filterCriteria === "budget") {
          url = `http://localhost:3000/guest/filter-activities?minBudget=${budget[0]}&maxBudget=${budget[1]}`;
        } else if (filterCriteria === "date") {
          url = `http://localhost:3000/guest/filter-activities?&date=${dateRange}`;
        } else if (filterCriteria === "category" && selectedCategories.length > 0) {
          url = `http://localhost:3000/guest/filter-activities?&category=${selectedCategories.join(",")}`;
        } else if (filterCriteria === "rating") {
          url = `http://localhost:3000/guest/filter-activities?&rating=${rating}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch activities");
        }
        const data = await response.json();
        // Check if the user is a tourist
if (userInfo.role === 'tourist') {
  // Filter activities to only include those that are not archived
  const filteredActivities = data.filter(activity => !activity.archived);
  setActivities(filteredActivities);
} else {
  // If the user is not a tourist, set all activities without filtering
  setActivities(data);
}
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, [sortCriteria, filterCriteria, budget, dateRange, selectedCategories, rating]);

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

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
        prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category]
    );
  };

  const handleUpcomingActivitiesDetails = (activityId) => {
    navigate(`/UpcomingActivities/${activityId}`);
  };

  return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <h2>Upcoming Activities</h2>

          <div className={styles.sortOptions}>
            <button onClick={() => setSortCriteria("date")} className={styles.viewButton} style={{ margin: '2px' }}>
              Sort by Date
            </button>
            <button onClick={() => setSortCriteria("price")} style={{ margin: '2px' }}>
              Sort by Price
            </button>
            <button onClick={() => setSortCriteria("rating")} style={{ margin: '2px' }}>
              Sort by Rating
            </button>
          </div>

          <div className={styles.filterOptions}>
            <label htmlFor="filter">Filter by: </label>
            <select id="filter" onChange={(e) => setFilterCriteria(e.target.value)}>
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

          {filterCriteria === "rating" && (
              <div className={styles.filterInput}>
                <label>Rating: {rating} </label>
                <input type="range" min="0" max="5" value={rating} onChange={(e) => setRating(e.target.value)} />
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

                        {activity.tags && activity.tags.length > 0 && (
                            <p>Tags: {activity.tags.map((tag) => tag.name).join(", ")}</p>
                        )}

                        {activity.category && activity.category.length > 0 && (
                            <p>Category: {activity.category.map((cat) => cat.type).join(", ")}</p>
                        )}
                        <p style={{ color: activity.bookingOpen ? "green" : "red" }}>
                          {activity.bookingOpen ? "Booking: Open" : "Booking: Closed"}
                        </p>
                        <p>
                          <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/UpcomingActivities/${activity._id}`)} className={styles.copyButton} style={{ margin: '2px' }}>
                            Copy link
                          </button>
                          <button onClick={() => handleUpcomingActivitiesDetails(activity._id)} className={styles.viewButton} style={{ margin: '2px' }}>
                            View Details
                          </button>
                          <button onClick={() => window.location.href = `mailto:?subject=Check out this historical place&body=${window.location.origin}/UpcomingActivities/${activity._id}`} className={styles.emailButton} style={{ margin: '2px' }}>
                            Email
                          </button>
                        </p>

                        <div className={styles.mapContainer}>
                          <MapContainer center={[activity.coordinates.lat || 51.505, activity.coordinates.lng || -0.09]} zoom={13} style={{ height: "100%", width: "100%" }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            {activity.coordinates.lat && activity.coordinates.lng && (
                                <Marker position={[activity.coordinates.lat, activity.coordinates.lng]} />
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
                             Flag
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

export default UpcomingActivities;