import React, { useState } from "react";
import axios from "axios";
import Footer from "/src/client/components/Footer/Footer";
import Header from '/src/client/components/Header/Header';
import Logo from "/src/client/Assets/Img/logo.png";
import styles from "./Search.module.css";
import { Link } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaTags, FaLanguage } from 'react-icons/fa';

const Search = () => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) {
      setError("Please enter a search query.");
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get("/tourist/search", {
        params: { query, type },
      });

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
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      <main className={styles.mainContent}>
        {/* <div className={`${styles.titleSection} bg-dark`}> */}
          <div className="container text-center py-5">
            <h1 className="display-4 mb-3 text-black">Discover Your Next Adventure</h1>
            <div className="d-flex justify-content-center">
              <p className="lead text-white-50 mb-0 w-75">Search through historical places, activities, and itineraries</p>
            </div>
          {/* </div> */}
        </div>

        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className={`${styles.searchCard} card shadow-sm`}>
                <div className="card-body p-4">
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSearch} className="mb-4">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control"
                            id="searchQuery"
                            placeholder="Enter your search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            required
                          />
                          <label htmlFor="searchQuery">Search Query</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating">
                          <select
                            className="form-select"
                            id="searchType"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            required
                          >
                            <option value="">Select a category</option>
                            <option value="historical">Historical Places</option>
                            <option value="activity">Activities</option>
                            <option value="itinerary">Itineraries</option>
                          </select>
                          <label htmlFor="searchType">Category</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <button 
                          type="submit" 
                          className={`${styles.searchButton} btn btn-primary w-100`}
                          disabled={isSearching}
                        >
                          {isSearching ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" />
                              Searching...
                            </>
                          ) : (
                            <>
                              <FaSearch className="me-2" />
                              Search
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Results Section */}
                  {results.historicalPlaces && results.historicalPlaces.length > 0 && (
                    <div className={styles.resultSection}>
                      <h3 className="mb-4">Historical Places</h3>
                      <div className="row g-4">
                        {results.historicalPlaces.map((item) => (
                          <div key={item._id} className="col-md-6">
                            <div className={`${styles.resultCard} card h-100`}>
                              {item.pictures && item.pictures.length > 0 && (
                                <div className={styles.imageContainer}>
                                  <img
                                    src={item.pictures[0]}
                                    alt={item.description}
                                    className="card-img-top"
                                  />
                                </div>
                              )}
                              <div className="card-body">
                                <h5 className="card-title">{item.description}</h5>
                                <div className="d-flex align-items-center mb-2">
                                  <FaMapMarkerAlt className="me-2" />
                                  <span>{item.location}</span>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                  <FaClock className="me-2" />
                                  <span>{item.openingHours}</span>
                                </div>
                                <div className="d-flex align-items-center">
                                  <FaMoneyBillWave className="me-2" />
                                  <span>${item.ticketPrices}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.activities && results.activities.length > 0 && (
                    <div className={styles.resultSection}>
                      <h3 className="mb-4">Activities</h3>
                      <div className="row g-4">
                        {results.activities.map((item) => (
                          <div key={item._id} className="col-md-6">
                            <div className={`${styles.resultCard} card h-100`}>
                              <div className="card-body">
                                <h5 className="card-title">{item.name}</h5>
                                <div className="d-flex align-items-center mb-2">
                                  <FaClock className="me-2" />
                                  <span>{item.date}</span>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                  <FaMapMarkerAlt className="me-2" />
                                  <span>{item.location}</span>
                                </div>
                                <div className="d-flex align-items-center">
                                  <FaMoneyBillWave className="me-2" />
                                  <span>${item.price}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.itineraries && results.itineraries.length > 0 && (
                    <div className={styles.resultSection}>
                      <h3 className="mb-4">Itineraries</h3>
                      <div className="row g-4">
                        {results.itineraries.map((item) => (
                          <div key={item._id} className="col-md-6">
                            <div className={`${styles.resultCard} card h-100`}>
                              <div className="card-body">
                                <h5 className="card-title">{item.title}</h5>
                                <p className="card-text">{item.name}</p>
                                <div className="d-flex align-items-center mb-2">
                                  <FaTags className="me-2" />
                                  <span>
                                    {item.tags.length > 0
                                      ? item.tags.map(tag => tag.name).join(", ")
                                      : "No tags"}
                                  </span>
                                </div>
                                <div className="d-flex align-items-center">
                                  <FaLanguage className="me-2" />
                                  <span>{item.language}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Search;
