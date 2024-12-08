import React, { useState } from 'react';
import axios from 'axios';
import { Modal } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPlane, FaSearch, FaCalendar, FaUsers } from 'react-icons/fa';
import styles from './BookFlight.module.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const BookingForm = () => {
  const [formData, setFormData] = useState({
    originLocationCode: '',
    destinationLocationCode: '',
    departureDate: null,
    returnDate: null,
    adults: '',
    children: '',
    infants: '',
    travelClass: 'ECONOMY',
    nonStop: false,
    maxPrice: '',
  });
  const location = useLocation();
  const bookedBy = location.state?.userId; // Retrieve bookedBy from location.state
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null); // State to hold the selected flight offer
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false); // State to manage booking confirmation
  const navigate = useNavigate();

  const handleOfferClick = (offer) => {
    setIsModalOpen(true);
    setSelectedOffer(offer);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOffer(null);
  };



  // Function to fetch the access token
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
    const { name, value, type, checked } = e.target;

    // Ensure date format is YYYY-MM-DD if input is a date field
    if (type === "checkbox") {
      setFormData((prevData) => ({ ...prevData, [name]: checked }));
    } else if (name === "departureDate" || name === "returnDate") {
      const formattedDate = new Date(value).toISOString().split('T')[0];
      setFormData((prevData) => ({ ...prevData, [name]: formattedDate }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        // First ensure we have a token
        if (!accessToken) {
            await fetchAccessToken();
        }

        // Format dates to YYYY-MM-DD
        const formatDate = (date) => {
            if (!date) return undefined;
            return date.toISOString().split('T')[0];
        };

        const params = {
            originLocationCode: formData.originLocationCode.toUpperCase(),
            destinationLocationCode: formData.destinationLocationCode.toUpperCase(),
            departureDate: formatDate(formData.departureDate),
            returnDate: formatDate(formData.returnDate),
            adults: parseInt(formData.adults) || 1,
            children: parseInt(formData.children) || undefined,
            infants: parseInt(formData.infants) || undefined,
            travelClass: formData.travelClass,
            nonStop: formData.nonStop,
            currencyCode: 'USD', // Add currency code
            max: 250 // Limit results
        };

        // Remove undefined values
        Object.keys(params).forEach(key => 
            params[key] === undefined && delete params[key]
        );

        console.log('Request params:', params); // Debug log

        const url = 'https://test.api.amadeus.com/v2/shopping/flight-offers';
        
        const response = await axios.get(url, {
            headers: { 
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            params: params
        });

        console.log('API Response:', response.data); // Debug log
        setResults(response.data.data);
    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        // Handle specific error cases
        if (error.response?.status === 401) {
            // Token expired, fetch new token and retry
            await fetchAccessToken();
            // You might want to retry the request here
        }
    } finally {
        setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    // Implement booking logic here, e.g., sending a booking request to your backend

    const params = {
      touristid: bookedBy,
      flightid: selectedOffer.id,
      aircraft: selectedOffer?.itineraries[0].segments[0].aircraft.code,
      originLocationCode: selectedOffer?.itineraries[0].segments[0].departure.iataCode,
      destinationLocationCode: selectedOffer?.itineraries[0].segments[0].arrival.iataCode,
      DepartureDate: selectedOffer?.itineraries[0].segments[0].departure.at,
      ArrivalDate: selectedOffer.itineraries[0].segments.slice(-1)[0].arrival.at,
      returnDate: formData.returnDate || undefined,
      adults: formData.adults,
      children: formData.children || 0,
      infants: formData.infants || 0,
      travelClass: formData.travelClass,
      nonStop: formData.nonStop,
      Price: selectedOffer.price.total,
    };
    // Conditionally add destinationLocationCode2 if it exists
    if (selectedOffer?.itineraries[0].segments[1]?.arrival.iataCode) {
      params.destinationLocationCode2 = selectedOffer.itineraries[0].segments[1].arrival.iataCode;
    }
    console.log(params)
    const response = await axios.post("/tourist/BookedFlights", params);
    if (response.status === 201) {
      console.log("error");
    }
    // Close modal after confirmation
    console.log('Booking confirmed for:', selectedOffer);
    handleCloseModal();
    setIsBookingConfirmed(true);
  };

  const handleViewMyBookings = async () => {
    navigate('/MyBookedFlights', { state: { bookedBy } });
  }

  const handleDateChange = (date, name) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
  };

  return (
    <div className={`${styles.pageWrapper} min-vh-100 d-flex flex-column`}>
      <Header />
      
      <main className="flex-grow-1">
        {/* <div className={styles.heroSection}> */}
          <div className="container text-center text-white">
            <h1 className="display-4 mb-3">Find Your Perfect Flight</h1>
            {/* <p className="lead mb-0">Search through thousands of flights worldwide</p> */}
          </div>
        {/* </div> */}

        <div className="container py-4">
          <div className="row">
            {/* Search Form */}
            <div className="col-lg-4 mb-4">
              <div className={`${styles.searchSection} card shadow-sm`}>
                <div className="card-body">
                  <h5 className="card-title mb-4">
                    <FaSearch className="me-2" />
                    Search Flights
                  </h5>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Origin</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaPlane />
                        </span>
                        <input
                          type="text"
                          name="originLocationCode"
                          className="form-control"
                          placeholder="e.g., JFK"
                          value={formData.originLocationCode}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Destination</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaPlane />
                        </span>
                        <input
                          type="text"
                          name="destinationLocationCode"
                          className="form-control"
                          placeholder="e.g., LAX"
                          value={formData.destinationLocationCode}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-6">
                        <label className="form-label">Departure</label>
                        <div className={`input-group ${styles.datePickerContainer}`}>
                          <span className="input-group-text">
                            <FaCalendar />
                          </span>
                          <DatePicker
                            selected={formData.departureDate}
                            onChange={(date) => handleDateChange(date, 'departureDate')}
                            className="form-control"
                            dateFormat="yyyy-MM-dd"
                            minDate={new Date()}
                            placeholderText="Select departure"
                            required
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <label className="form-label">Return</label>
                        <div className={`input-group ${styles.datePickerContainer}`}>
                          <span className="input-group-text">
                            <FaCalendar />
                          </span>
                          <DatePicker
                            selected={formData.returnDate}
                            onChange={(date) => handleDateChange(date, 'returnDate')}
                            className="form-control"
                            dateFormat="yyyy-MM-dd"
                            minDate={formData.departureDate || new Date()}
                            placeholderText="Select return"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-4">
                        <label className="form-label">Adults</label>
                        <input
                          type="number"
                          name="adults"
                          className="form-control"
                          value={formData.adults}
                          onChange={handleChange}
                          min="1"
                          required
                        />
                      </div>
                      <div className="col-4">
                        <label className="form-label">Children</label>
                        <input
                          type="number"
                          name="children"
                          className="form-control"
                          value={formData.children}
                          onChange={handleChange}
                          min="0"
                        />
                      </div>
                      <div className="col-4">
                        <label className="form-label">Infants</label>
                        <input
                          type="number"
                          name="infants"
                          className="form-control"
                          value={formData.infants}
                          onChange={handleChange}
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Travel Class</label>
                      <select 
                        name="travelClass" 
                        className="form-select"
                        value={formData.travelClass} 
                        onChange={handleChange}
                      >
                        <option value="ECONOMY">Economy</option>
                        <option value="PREMIUM_ECONOMY">Premium Economy</option>
                        <option value="BUSINESS">Business</option>
                        <option value="FIRST">First</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          name="nonStop"
                          className="form-check-input"
                          checked={formData.nonStop}
                          onChange={handleChange}
                          id="nonStop"
                        />
                        <label className="form-check-label" htmlFor="nonStop">
                          Non-Stop Flights Only
                        </label>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                      <FaSearch className="me-2" />
                      Search Flights
                    </button>
                  </form>
                </div>
              </div>
              
              <button 
                onClick={handleViewMyBookings}
                className={`btn btn-outline-primary w-100 mt-3 ${styles.viewBookingsButton}`}
              >
                View My Bookings
              </button>
            </div>

            {/* Results Section */}
            <div className="col-lg-8">
              <div className={`${styles.resultsWrapper} card shadow-sm`}>
                <div className="card-body">
                  <h5 className="card-title mb-4">
                    <FaPlane className="me-2" />
                    Flight Results
                  </h5>
                  
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" />
                      <p className="mt-2 mb-0">Searching for flights...</p>
                    </div>
                  ) : results.length > 0 ? (
                    <div className="row g-4">
                      {results.map((offer) => (
                        <div key={offer.id} className="col-12">
                          <div className={`${styles.flightCard} card h-100`}>
                            <div className="card-body">
                              <div className="row align-items-center">
                                <div className="col-md-8">
                                  <h5 className="card-title mb-3">
                                    {offer.itineraries[0].segments[0].departure.iataCode} → 
                                    {offer.itineraries[0].segments.slice(-1)[0].arrival.iataCode}
                                  </h5>
                                  <p className="mb-2">
                                    <strong>Departure:</strong> {new Date(offer.itineraries[0].segments[0].departure.at).toLocaleString()}
                                  </p>
                                  <p className="mb-2">
                                    <strong>Arrival:</strong> {new Date(offer.itineraries[0].segments.slice(-1)[0].arrival.at).toLocaleString()}
                                  </p>
                                  <p className="mb-0">
                                    <strong>Airline:</strong> {offer.itineraries[0].segments[0].carrierCode}
                                  </p>
                                </div>
                                <div className="col-md-4 text-md-end mt-3 mt-md-0">
                                  <h4 className="text-primary mb-3">
                                    {offer.price.total} {offer.price.currency}
                                  </h4>
                                  <button
                                    className="btn btn-primary w-100"
                                    onClick={() => handleOfferClick(offer)}
                                  >
                                    Book Now
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <p className={`mb-0 ${styles.emptyMessage}`}>
                        Search for flights to see results
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
        <div className={`${styles.modalContent} bg-white rounded-3 shadow-lg`}>
          <div className="modal-header border-bottom">
            <h5 className="modal-title">Confirm Your Booking</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={handleCloseModal}
            />
          </div>

          <div className="modal-body">
            {selectedOffer && (
              <div className="row g-4">
                <div className="col-md-6">
                  <h6>Flight Details</h6>
                  <ul className="list-unstyled">
                    <li>From: {selectedOffer.itineraries[0].segments[0].departure.iataCode}</li>
                    <li>To: {selectedOffer.itineraries[0].segments.slice(-1)[0].arrival.iataCode}</li>
                    <li>Airline: {selectedOffer.itineraries[0].segments[0].carrierCode}</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6>Price Details</h6>
                  <h4 className="text-primary">
                    {selectedOffer.price.total} {selectedOffer.price.currency}
                  </h4>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer border-top">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleCloseModal}
            >
              Close
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleConfirmBooking}
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

export default BookingForm;
