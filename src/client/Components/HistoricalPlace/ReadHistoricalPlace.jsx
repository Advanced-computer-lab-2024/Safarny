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
      const response = await axios.get(
        "http://localhost:3000/toursimgovernor/places"
      );
      const placesData = response.data;

      if (Array.isArray(placesData)) {
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
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
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
      
      <div className="container py-5">
        <h1 className="text-center mb-5">Historical Places</h1>

        {/* Filter Section */}
        <div className={`${styles.filterSection} row g-3 mb-4`}>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search by description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Filter by opening hours..."
              value={openingHoursFilter}
              onChange={(e) => setOpeningHoursFilter(e.target.value)}
            />
          </div>
          
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Filter by tag..."
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
            >
              {currencyCodes.map((code) => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Governor Filter Button */}
        {userInfo.role === "TourismGovernor" && (
          <div className="text-center mb-4">
            <button
              onClick={handleFilterByGovernor}
              className="btn btn-outline-light"
            >
              {filterByGovernor ? "Show All Places" : "Show My Places"}
            </button>
          </div>
        )}

        {/* Places Grid */}
        {filteredPlaces.length > 0 ? (
          <div className="row g-4">
            {filteredPlaces.map((place) => {
              const hasCoordinates = place.coordinates?.lat !== undefined && place.coordinates?.lng !== undefined;
              const convertedPrice = convertPrice(place.ticketPrices, place.currency, selectedCurrency);
              
              return (
                <div className="col-lg-6 col-xl-4" key={place._id}>
                  <div className={`card h-100 ${styles.placeCard}`}>
                    {place.pictures?.[0] && (
                      <img
                        src={place.pictures[0]}
                        className="card-img-top"
                        alt={place.description}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    )}
                    
                    <div className="card-body">
                      <h5 className="card-title">{place.description}</h5>
                      <div className={`${styles.cardDetails} mb-3`}>
                        <p className="mb-2"><strong>Opening Hours:</strong> {place.openingHours}</p>
                        <p className="mb-2"><strong>Price:</strong> {convertedPrice} {selectedCurrency}</p>
                        <p className="mb-2"><strong>Tags:</strong> {place.tags?.map(tag => tag.name).join(", ") || "No tags"}</p>
                      </div>

                      {hasCoordinates && (
                        <div className={`${styles.mapWrapper} mb-3`}>
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

                      <div className="d-flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleReadHistoricalPlaceDetails(place._id)}
                          className="btn btn-primary btn-sm"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => navigator.clipboard.writeText(`${window.location.origin}/historical-place/${place._id}`)}
                          className="btn btn-outline-secondary btn-sm"
                        >
                          Copy Link
                        </button>
                        <button
                          onClick={() => window.location.href = `mailto:?subject=Check out this historical place&body=${window.location.origin}/historical-place/${place._id}`}
                          className="btn btn-outline-secondary btn-sm"
                        >
                          Share via Email
                        </button>
                        
                        {userInfo.role === "TourismGovernor" && (
                          <>
                            <button
                              onClick={() => handleUpdateHistoricalPlace(place._id)}
                              className="btn btn-warning btn-sm"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => handleDeleteHistoricalPlace(place._id)}
                              className="btn btn-danger btn-sm"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="alert alert-info">No historical places available</div>
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
