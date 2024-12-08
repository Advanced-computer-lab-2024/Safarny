import React, { useState } from 'react';
import axios from 'axios';
import { Modal } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaHotel, FaSearch, FaList, FaMapMarkerAlt, FaBed, FaCalendar, FaUsers } from 'react-icons/fa';
import styles from './BookingHotel.module.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const amenitiesOptions = [
  'SWIMMING_POOL', 'SPA', 'FITNESS_CENTER', 'AIR_CONDITIONING', 'RESTAURANT', 'PARKING', 'PETS_ALLOWED', 'AIRPORT_SHUTTLE', 
  'BUSINESS_CENTER', 'DISABLED_FACILITIES', 'WIFI', 'MEETING_ROOMS', 'NO_KID_ALLOWED', 'TENNIS', 'GOLF', 'KITCHEN', 
  'ANIMAL_WATCHING', 'BABY-SITTING', 'BEACH', 'CASINO', 'JACUZZI', 'SAUNA', 'SOLARIUM', 'MASSAGE', 'VALET_PARKING', 
  'BAR or LOUNGE', 'KIDS_WELCOME', 'NO_PORN_FILMS', 'MINIBAR', 'TELEVISION', 'WI-FI_IN_ROOM', 'ROOM_SERVICE', 'GUARDED_PARKG', 
  'SERV_SPEC_MENU'
];

const ratingsOptions = [1, 2, 3, 4, 5];
const radiusUnits = ['KM', 'MILE'];
const hotelSources = ['BEDBANK', 'DIRECTCHAIN', 'ALL'];

const BookingHotel = () => {
  const navigate=useNavigate();
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [offerDetails, setOfferDetails] = useState(null);
  const location = useLocation();
  const bookedBy  = location.state?.userId; // Retrieve bookedBy from location.state
  const [formData, setFormData] = useState({
    cityCode: '',
    radius: 5,
    radiusUnit: 'KM',
    chainCodes: '',
    amenities: '',
    ratings: '',
    hotelSource: 'ALL',
  });
  const [accessToken, setAccessToken] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAccessToken = async () => {
    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', 'nXo0wGO6OEafTR0cMHL7NXgRWyqcGME5'); // Replace with your actual client ID
      params.append('client_secret', 'ik5Ty4Hf7kJTIlQg'); // Replace with your actual client secret

      const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      setAccessToken(response.data.access_token);
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accessToken) {
      await fetchAccessToken();
    }
    setLoading(true);

    const url = `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city`;
    const params = {
      cityCode: formData.cityCode,
      radius: formData.radius,
      radiusUnit: formData.radiusUnit,
      amenities: formData.amenities || undefined,
      ratings: formData.ratings || undefined,  
      hotelSource: formData.hotelSource || undefined,
    };

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params,
      });
      setHotels(response.data.data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMyBooking = async () => {
    navigate('/MyBookedHotel', { state: { bookedBy } });
  } 
  const handleOfferClick = async (hotel) => {
    setSelectedOffer(hotel);
    setIsModalOpen(true);
    try {
      // Always fetch a new token before making the request
      await fetchAccessToken();
      
      // Get dates in YYYY-MM-DD format with proper validation
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Format dates to YYYY-MM-DD
      const checkInDate = today.toISOString().slice(0, 10);
      const checkOutDate = tomorrow.toISOString().slice(0, 10);

      const url = 'https://test.api.amadeus.com/v3/shopping/hotel-offers';
      
      // Ensure all required parameters are present and properly formatted
      const params = {
        hotelIds: hotel.hotelId,
        adults: 1,
        checkInDate,
        checkOutDate,
        roomQuantity: 1,
        paymentPolicy: 'NONE',
        bestRateOnly: true
      };

      console.log('Request params:', params); // Debug log

      const response = await axios.get(url, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        params,
        validateStatus: function (status) {
          return status < 500; // Resolve only if status code is less than 500
        }
      });

      if (response.status === 400) {
        console.error('API Error Response:', response.data);
        setOfferDetails(null);
        return;
      }

      if (response.data && response.data.data && response.data.data[0]) {
        setOfferDetails(response.data.data[0]);
      } else {
        console.warn('No offer details available for this hotel');
        setOfferDetails(null);
      }
    } catch (error) {
      console.error('Error fetching hotel offers:', error);
      if (error.response?.status === 401) {
        try {
          await fetchAccessToken();
          // Wait a brief moment before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
          handleOfferClick(hotel); // Retry the request
        } catch (retryError) {
          console.error('Error after token refresh:', retryError);
          setOfferDetails(null);
        }
      } else {
        // Log the full error response for debugging
        if (error.response) {
          console.error('Error Response Data:', error.response.data);
          console.error('Error Response Status:', error.response.status);
          console.error('Error Response Headers:', error.response.headers);
        }
        setOfferDetails(null);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOffer(null);
    setOfferDetails(null);
  };
  const handleBooking = async() => {
    const params={
      touristid: bookedBy,
      hotelid: selectedOffer.hotelId,
      hotelName:selectedOffer.name,
      checkInDate: offerDetails.offers[0].checkInDate,
      checkOutDate:offerDetails.offers[0].checkInDate,
      adults: offerDetails.offers[0].guests.adults,
      roomType: offerDetails.offers[0].room.typeEstimated.category,
      Price: parseFloat(offerDetails.offers[0].price.total) ,
      hotelDistancefromCenter: parseFloat(selectedOffer.distance.value) ,
      hotelDescription: offerDetails.offers[0].room.description.text,
    }
    console.log(params)
    const response = await axios.post("/tourist/BookHotel", params);
    if (response.status === 201) {
        console.log("error");
    }
    // Close modal after confirmation
    console.log('Booking confirmed for:', selectedOffer);
    setIsModalOpen(false);
  };

  return (
    <div className={`${styles.pageWrapper} min-vh-100 d-flex flex-column`}>
      <Header />
      
      <main className="flex-grow-1">
        {/* <div className={`${styles.heroSection} py-5 text-center text-white`}> */}
          <div className="container">
            <h1 className="display-4 mb-3">Find Your Perfect Stay</h1>
            {/* <p className="lead mb-0">Search through thousands of hotels worldwide</p> */}
          </div>
        {/* </div> */}

        <div className="container py-5">
          <div className="row">
            {/* Search Form */}
            <div className="col-lg-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-4">
                    <FaSearch className="me-2" />
                    Search Hotels
                  </h5>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">City Code</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaMapMarkerAlt />
                        </span>
                        <input
                          type="text"
                          name="cityCode"
                          className="form-control"
                          value={formData.cityCode}
                          onChange={handleChange}
                          required
                          placeholder="e.g., PAR"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className={`col-8 ${styles.radiusContainer}`}>
                        <label className="form-label">Radius</label>
                        <input
                          type="number"
                          name="radius"
                          className={`form-control ${styles.radiusInput}`}
                          value={formData.radius}
                          onChange={handleChange}
                        />
                      </div>
                      <div className={`col-4 ${styles.unitContainer}`}>
                        <label className="form-label">Unit</label>
                        <select
                          name="radiusUnit"
                          className={`form-select ${styles.unitSelect}`}
                          value={formData.radiusUnit}
                          onChange={handleChange}
                        >
                          {radiusUnits.map((unit) => (
                            <option key={unit} value={unit}>{unit}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Amenities</label>
                      <select
                        name="amenities"
                        className="form-select"
                        value={formData.amenities}
                        onChange={handleChange}
                      >
                        <option value="">Select Amenity</option>
                        {amenitiesOptions.map((option) => (
                          <option key={option} value={option}>
                            {option.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Rating</label>
                      <select
                        name="ratings"
                        className="form-select"
                        value={formData.ratings}
                        onChange={handleChange}
                      >
                        <option value="">Select Rating</option>
                        {ratingsOptions.map((option) => (
                          <option key={option} value={option}>
                            {"⭐".repeat(option)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button 
                      type="submit" 
                      className={`btn btn-primary w-100 ${styles.searchButton}`}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <FaSearch className="me-2" />
                          Search Hotels
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              <div className="mt-4">
                <button 
                  onClick={handleViewMyBooking}
                  className={`btn btn-outline-primary w-100 ${styles.viewBookingsButton}`}
                >
                  <FaList className="me-2" />
                  View My Bookings
                </button>
              </div>
            </div>

            {/* Results Section */}
            <div className="col-lg-8">
              <div className={`${styles.resultsWrapper} card shadow-sm`}>
                <div className="card-body">
                  <h5 className="card-title mb-4">
                    <FaHotel className="me-2" />
                    Hotel Results
                  </h5>
                  
                  {hotels.length > 0 ? (
                    <div className="row g-4">
                      {hotels.map((hotel) => (
                        <div key={hotel.hotelId} className="col-md-6">
                          <div className={`${styles.hotelCard} card h-100`}>
                            <div className="card-body">
                              <h5 className="card-title">{hotel.name}</h5>
                              <p className="card-text">
                                <small className="text-muted">
                                  <div className={styles.hotelDistance}>
                                    <FaMapMarkerAlt className="me-2" />
                                    <span className={styles.distanceText}>
                                        {hotel.distance.value} {hotel.distance.unit} from center
                                    </span>
                                  </div>
                                </small>
                              </p>
                              <button
                                className="btn btn-outline-primary w-100"
                                onClick={() => handleOfferClick(hotel)}
                              >
                                View Offers
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <p className={`mb-0 ${styles.emptyMessage}`}>
                        {loading ? 'Searching for hotels...' : 'No results found.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      <Modal 
        open={isModalOpen} 
        onClose={handleCloseModal}
        className={styles.modalWrapper}
      >
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h5 className="m-0">Hotel Offer Details</h5>
            <button 
              className={styles.closeButton}
              onClick={handleCloseModal}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className={styles.modalBody}>
            {selectedOffer && offerDetails ? (
              <>
                <h4 className="mb-4">{selectedOffer.name}</h4>
                
                <div className={styles.roomDetails}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <h6 className="mb-3">Room Details</h6>
                      <ul className="list-unstyled mb-0">
                        <li className="mb-2">
                          <FaBed className="me-2 text-primary" />
                          {offerDetails.offers[0].room.typeEstimated.category}
                        </li>
                        <li className="mb-2">
                          <span className="me-2">🛏️</span>
                          {offerDetails.offers[0].room.typeEstimated.beds} {offerDetails.offers[0].room.typeEstimated.bedType}
                        </li>
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <h6 className="mb-3">Stay Details</h6>
                      <ul className="list-unstyled mb-0">
                        <li className="mb-2">
                          <FaCalendar className="me-2 text-primary" />
                          Check-in: {new Date(offerDetails.offers[0].checkInDate).toLocaleDateString()}
                        </li>
                        <li className="mb-2">
                          <FaCalendar className="me-2 text-primary" />
                          Check-out: {new Date(offerDetails.offers[0].checkOutDate).toLocaleDateString()}
                        </li>
                        <li>
                          <FaUsers className="me-2 text-primary" />
                          {offerDetails.offers[0].guests.adults} Adults
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h6 className="mb-3">Description</h6>
                  <p className="mb-4">{offerDetails.offers[0].room.description.text}</p>
                </div>

                <div className={styles.priceTag}>
                  <small className="text-muted">Total Price</small>
                  <div className={styles.priceAmount}>
                    {offerDetails.offers[0].price.total} {offerDetails.offers[0].price.currency}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" />
                <p className="mt-2 mb-0">Loading offer details...</p>
              </div>
            )}
          </div>

          <div className={styles.modalFooter}>
            <button 
              type="button" 
              className="btn btn-outline-secondary"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleBooking}
              disabled={!offerDetails}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default BookingHotel;
