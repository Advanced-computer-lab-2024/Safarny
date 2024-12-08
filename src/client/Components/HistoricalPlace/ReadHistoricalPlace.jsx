import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Footer from "/src/client/components/Footer/Footer";
import Header from "/src/client/components/Header/Header";
import styles from "./ReadHistoricalPlace.module.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import MyBookingModal from "/src/client/Components/Booking/MyBookingModal";

const ReadHistoricalPlace = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openingHoursFilter, setOpeningHoursFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("EGP");
  const [userInfo, setUserInfo] = useState({ role: "", userId: "" });
  const [filterByGovernor, setFilterByGovernor] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {};
  const [exchangeRates, setExchangeRates] = useState({});
  const [currencyCodes, setCurrencyCodes] = useState([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);

  const fetchExchangeRates = async () => {
    try {
      const response = await axios.get(
          import.meta.env.VITE_EXCHANGE_API_URL
      );
      setExchangeRates(response.data.conversion_rates);
      setCurrencyCodes(Object.keys(response.data.conversion_rates));
    } catch (err) {
      console.error("Error fetching exchange rates:", err);
    }
  };

  const convertPrice = (price, fromCurrency, toCurrency) => {
    const rateFrom = exchangeRates[fromCurrency];
    const rateTo = exchangeRates[toCurrency];
    return ((price / rateFrom) * rateTo).toFixed(2);
  };

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const fetchHistoricalPlaces = async () => {
    try {
      // First get user preferences if userId exists
      let userPreferences = [];
      if (userId) {
        const userResponse = await axios.get(`http://localhost:3000/tourist/${userId}`);
        userPreferences = userResponse.data.preferedhistoricaltags || [];
      }

      const response = await axios.get("http://localhost:3000/toursimgovernor/places");
      let placesData = response.data;

      if (Array.isArray(placesData)) {
        // Sort places based on user preferences if they exist
        if (userPreferences.length > 0) {
          placesData.sort((a, b) => {
            const aMatchCount = a.tags.filter(tag => userPreferences.includes(tag._id)).length;
            const bMatchCount = b.tags.filter(tag => userPreferences.includes(tag._id)).length;
            return bMatchCount - aMatchCount;
          });
        }
        setPlaces(placesData);
      } else {
        console.error("Expected an array, but got:", typeof placesData);
        setError("Invalid data format received");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching historical places:", err);
      setError("Failed to fetch historical places");
      setLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(
          `http://localhost:3000/tourist/${userId}`
      );
      const userData = response.data;
      setUserInfo(userData);
      setSelectedCurrency(userData.walletcurrency); // Set the default selected currency
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserInfo();
    }
    fetchHistoricalPlaces();
  }, [userId]);

  const fetchHistoricalPlacesByGovernor = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/toursimgovernor/places/governor/${userInfo.userId}`
      );
      const placesData = response.data;

      if (Array.isArray(placesData)) {
        const filteredPlaces = placesData.filter((place) => place.createdby);
        setPlaces(filteredPlaces);
      } else {
        console.error("Expected an array, but got:", typeof placesData);
        setError("Invalid data format received");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching historical places:", err);
      setError("Failed to fetch historical places");
      setLoading(false);
    }
  };

  const handleFilterByGovernor = () => {
    setFilterByGovernor((prev) => !prev);
  };

  useEffect(() => {
    if (filterByGovernor) {
      fetchHistoricalPlacesByGovernor();
    } else {
      fetchHistoricalPlaces();
    }
  }, [filterByGovernor]);

  const filteredPlaces = places.filter((place) => {
    const convertedPrice = convertPrice(
      place.ticketPrices,
      place.currency,
      selectedCurrency
    );
    return (
      place.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (openingHoursFilter
        ? place.openingHours
            .toLowerCase()
            .includes(openingHoursFilter.toLowerCase())
        : true) &&
      (tagFilter
        ? place.tags.some((tag) =>
            tag.name.toLowerCase().includes(tagFilter.toLowerCase())
          )
        : true)
    );
  });

  const handleUpdateHistoricalPlace = (placeId) => {
    navigate(`/update-historical-place/${placeId}`);
  };

  const handleReadHistoricalPlaceDetails = (placeId) => {
    navigate(`/historical-place/${placeId}`);
  };

  const handleDeleteHistoricalPlace = async (placeId) => {
    try {
      await axios.delete(
        `http://localhost:3000/toursimgovernor/places/${placeId}`
      );
      setPlaces((prevPlaces) =>
        prevPlaces.filter((place) => place._id !== placeId)
      );
    } catch (err) {
      console.error("Error deleting historical place:", err);
      setError("Failed to delete historical place");
    }
  };

  const handleReadHistoricalPlaceBook = (placeId) => {
    //use MyBookingModal.jsx to book a historical place
    setSelectedPlaceId(placeId);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedPlaceId(null);
  };


  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger m-4">{error}</div>;
  }

  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      <div className="container-fluid px-4 py-5" style={{ width: '100vw' }}>
        <div className={styles.pageHeader}>
          <h1 className="text-center mb-4 text-black">Discover Historical Places</h1>
          {/* <p className="text-center text-muted mb-5">Explore Egypt's rich heritage and ancient wonders</p> */}
        </div>

        {/* Enhanced Filter Section */}
        <div className={`${styles.filterSection} mb-5`}>
          <div className="row g-4">
            <div className="col-md-4">
              <div className={styles.filterGroup}>
                <div className={styles.filterIcon}>
                  <i className="fas fa-search"></i>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search historical places..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="col-md-3">
              <div className={styles.filterGroup}>
                <div className={styles.filterIcon}>
                  <i className="fas fa-clock"></i>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Opening hours..."
                  value={openingHoursFilter}
                  onChange={(e) => setOpeningHoursFilter(e.target.value)}
                />
              </div>
            </div>
            
            <div className="col-md-3">
              <div className={styles.filterGroup}>
                <div className={styles.filterIcon}>
                  <i className="fas fa-tags"></i>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by tag..."
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  style={{backgroundColor: 'var(--form-background)', color: '#fff'}}
                />
              </div>
            </div>

            <div className="col-md-2">
              <div className={styles.filterGroup}>
                <div className={styles.filterIcon}>
                  <i className="fas fa-money-bill-wave"></i>
                </div>
                <select
                  className="form-select"
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  style={{backgroundColor: 'var(--form-background)', color: 'var(--heading-color)'}}
                >
                  {currencyCodes.map((code) => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {userInfo.role === "TourismGovernor" && (
            <div className="text-center mt-4">
              <button
                onClick={handleFilterByGovernor}
                className={`${styles.filterButton} btn`}
              >
                <i className={`fas ${filterByGovernor ? 'fa-globe' : 'fa-filter'} me-2`}></i>
                {filterByGovernor ? "Show All Places" : "Show My Places"}
              </button>
            </div>
          )}
        </div>

        {/* Places Grid */}
        {filteredPlaces.length > 0 ? (
          <div className="row g-4">
            {filteredPlaces.map((place) => {
              const hasCoordinates = place.coordinates?.lat !== undefined && place.coordinates?.lng !== undefined;
              const convertedPrice = convertPrice(place.ticketPrices, place.currency, selectedCurrency);
              
              return (
                <div className="col-lg-6 col-xl-4" key={place._id}>
                  <div className={styles.placeCard}>
                    {place.pictures?.[0] && (
                      <div className={styles.cardImageWrapper}>
                        <img
                          src={place.pictures[0]}
                          className="card-img-top"
                          alt={place.description}
                        />
                        <div className={styles.cardPriceTag}>
                          {convertedPrice} {selectedCurrency}
                        </div>
                      </div>
                    )}
                    
                    <div className={styles.cardContent}>
                      <h3 className={styles.cardTitle}>{place.description}</h3>
                      
                      <div className={styles.cardDetails}>
                        <div className={styles.infoItem}>
                          <i className="fas fa-clock"></i>
                          <span>{place.openingHours}</span>
                        </div>
                        
                        <div className={styles.tagContainer}>
                          {place.tags?.map(tag => (
                            <span key={tag._id} className={styles.tag}>
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      {hasCoordinates && (
                        <div className={styles.mapWrapper}>
                          <MapContainer
                            center={[place.coordinates.lat, place.coordinates.lng]}
                            zoom={13}
                            style={{ height: "200px", width: "100%" }}
                          >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={[place.coordinates.lat, place.coordinates.lng]} />
                          </MapContainer>
                        </div>
                      )}

                      <div className={styles.cardActions}>
                        <button
                          onClick={() => handleReadHistoricalPlaceDetails(place._id)}
                          className={styles.primaryButton}
                        >
                          <i className="fas fa-info-circle me-2"></i>
                          View Details
                        </button>
                        
                        {userId && (
                          <button
                            onClick={() => handleReadHistoricalPlaceBook(place._id)}
                            className={styles.bookButton}
                          >
                            <i className="fas fa-ticket-alt me-2"></i>
                            Book Now
                          </button>
                        )}

                        <div className={styles.shareActions}>
                          <button
                            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/historical-place/${place._id}`)}
                            className={styles.shareButton}
                          >
                            <i className="fas fa-link me-2"></i>
                            Copy Link
                          </button>
                          <button
                            onClick={() => window.location.href = `mailto:?subject=Check out this historical place&body=${window.location.origin}/historical-place/${place._id}`}
                            className={styles.shareButton}
                          >
                            <i className="fas fa-envelope me-2"></i>
                            Share via Email
                          </button>
                        </div>
                        
                        {userInfo.role === "TourismGovernor" && (
                          <div className={styles.adminActions}>
                            <button
                              onClick={() => handleUpdateHistoricalPlace(place._id)}
                              className={styles.editButton}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteHistoricalPlace(place._id)}
                              className={styles.deleteButton}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.noResults}>
            <i className="fas fa-search fa-3x mb-3"></i>
            <h3>No Places Found</h3>
            <p>Try adjusting your filters to find more historical places</p>
          </div>
        )}
      </div>

      <Footer />

      {isBookingModalOpen && (
        <MyBookingModal
          userId={userId}
          isOpen={isBookingModalOpen}
          onRequestClose={closeBookingModal}
          bookingType="historicalPlace"
          bookingId={selectedPlaceId}
        />
      )}
    </div>
  );
};

export default ReadHistoricalPlace;
