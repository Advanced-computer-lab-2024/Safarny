import React, { useEffect, useState } from "react";
import styles from "./UpcomingActivities.module.css";
import Logo from "/src/client/Assets/Img/logo.png";
import Footer from "/src/client/components/Footer/Footer";
import { Link } from "react-router-dom";

const UpcomingItineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("date");
  const [budget, setBudget] = useState(0);
  const [date, setDate] = useState("");
  const [preferences, setPreferences] = useState([]);
  const [language, setLanguage] = useState("");

  useEffect(() => {
    fetchFilteredItineraries(true);
  }, [sortCriteria]);

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
      <header className={styles.header}>
        <img src={Logo} alt="Safarny Logo" className={styles.logo} />
        <h1>Safarny</h1>
        <nav className={styles.nav}>
          <Link to="/" className={styles.button}>
            Back to Home
          </Link>
        </nav>
      </header>

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

          {/* Preferences Filter */}
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
              <option value="historic">Historic Areas</option>
              <option value="beaches">Beaches</option>
              <option value="family">Family-Friendly</option>
              <option value="shopping">Shopping</option>
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

          {/* Apply Filters Button */}
          <button onClick={handleFilterClick}>Apply Filters</button>
        </div>

        {/* Itinerary List */}
        <section className={styles.itineraryList}>
          {itineraries.length === 0 ? (
            <p>No upcoming itineraries found.</p>
          ) : (
            itineraries.map((itinerary) => (
              <div key={itinerary._id} className={styles.itineraryItem}>
                <h3>{itinerary.name}</h3>
                <p>Duration: {itinerary.duration} hours</p>
                <p>Language: {itinerary.language}</p>
                <p>Price: {itinerary.price}$</p>
                <p>Available Dates: {itinerary.availableDates.join(", ")}</p>
                <p>Available Times: {itinerary.availableTimes.join(", ")}</p>
                <p>Accessibility: {itinerary.accessibility ? "Yes" : "No"}</p>
                <p>Pickup Location: {itinerary.pickupLocation}</p>
                <p>Dropoff Location: {itinerary.dropoffLocation}</p>

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
            ))
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default UpcomingItineraries;
