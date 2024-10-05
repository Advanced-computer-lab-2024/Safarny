import React, { useState } from "react";
import axios from "axios";
import Footer from "/src/client/components/Footer/Footer";
import Logo from "/src/client/Assets/Img/logo.png";
import styles from "./Search.module.css";
import { Link } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState(""); // Define type as per your needs (e.g., 'historical', 'activity')
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  // Handle form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    console.log("Submitting form with:", { query, type }); // Add this line

    if (!query) {
      setError("Please enter a search query.");
      return;
    }
    console.log({ query, type }); // Log them before sending

    try {
      const response = await axios.get("http://localhost:3000/tourist/search", {
        params: { query, type },
      });

      //console.log('API Response:', response.data);
      console.log("Response:", response); // Log the full response to inspect it
      console.log("Search Results:", response.data.results); // Add this line

      if (response.data.success) {
        setResults(response.data.results);

        setError("");
      } else {
        setResults([]);
        setError(response.data.message);
      }
    } catch (err) {
      console.error("Error occurred while searching:", err);
      setResults([]);
      setError("An error occurred while searching.");
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
        <h2>Search for new adventures</h2>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <form onSubmit={handleSearch} className={styles.form}>
          <label>
            Search Query:
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
          </label>
          <label>
            Type:
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="">Select Type</option>
              <option value="historical">Historical Places</option>
              <option value="activity">Activities</option>
              <option value="itinerary">Itineraries</option>
            </select>
          </label>
          <button type="submit" className={styles.button}>
            Search
          </button>
        </form>

        {results.historicalPlaces && results.historicalPlaces.length > 0 && (
          <div className={styles.results}>
            <h3>Historical Places:</h3>
            <ul>
              {results.historicalPlaces.map((item) => (
                <li key={item._id} className={styles.resultItem}>
                  <h4>{item.description}</h4>
                  {item.pictures && item.pictures.length > 0 && (
                    <div className={styles.imageContainer}>
                      {item.pictures.map((pic, index) => (
                        <img
                          key={index}
                          src={pic}
                          alt={`Image of ${item.description}`}
                          className={styles.resultImage}
                        />
                      ))}
                    </div>
                  )}
                  <p>Location: {item.location}</p>
                  <p>Opening Hours: {item.openingHours}</p>
                  <p>Ticket Prices: ${item.ticketPrices}</p>
                  {/* Add more fields as necessary */}
                </li>
              ))}
            </ul>
          </div>
        )}

        {results.activities && results.activities.length > 0 && (
          <div className={styles.results}>
            <h3>Activities:</h3>
            <ul>
              {results.activities.map((item) => (
                <li key={item._id} className={styles.resultItem}>
                  <h4>{item.name}</h4>

                  <p>date: {item.date}</p>
                  <p>Location: {item.location}</p>
                  <p>Price: ${item.price}</p>
                  {/* Add more fields as necessary */}
                </li>
              ))}
            </ul>
          </div>
        )}

        {results.itineraries && results.itineraries.length > 0 && (
          <div className={styles.results}>
            <h3>Itineraries:</h3>
            <ul>
              {results.itineraries.map((item) => (
                <li key={item._id} className={styles.resultItem}>
                  <h4>{item.title}</h4>
                  <p>name: {item.name}</p>
                  <p>
                    tags:
                    {item.tags.length > 0 ? (
                      item.tags.map((tag) => (
                        <span key={tag._id}>{tag.name} </span>
                      ))
                    ) : (
                      <span>No tags</span>
                    )}
                  </p>
                  <p>lang: {item.language}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
export default Search;
