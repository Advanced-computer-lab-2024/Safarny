import React, { useState } from 'react';
import axios from 'axios';
// import styles from './BookingForm.module.css';
import { Button, Modal } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from "./BookFlight.module.css";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    originLocationCode: '',
    destinationLocationCode: '',
    departureDate: '',
    returnDate: '',
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
    fetchAccessToken();
    const url = `https://test.api.amadeus.com/v2/shopping/flight-offers`;

    const params = {
      originLocationCode: formData.originLocationCode,
      destinationLocationCode: formData.destinationLocationCode,
      departureDate: formData.departureDate,
      returnDate: formData.returnDate || undefined,
      adults: formData.adults,
      children: formData.children || undefined,
      infants: formData.infants || undefined,
      travelClass: formData.travelClass,
      nonStop: formData.nonStop,
      maxPrice: formData.maxPrice || undefined,
    };

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params,
      });
      setResults(response.data.data);
    } catch (error) {
      console.error('Error fetching flight offers:', error);
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

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.bookingFormContainer}>
        <div className={styles.searchSection}>
          <h2>Find Your Flight</h2>
          <form onSubmit={handleSubmit} className={styles.searchForm}>
            <input type="text" name="originLocationCode" placeholder="Origin" value={formData.originLocationCode}
              onChange={handleChange} required />
            <input type="text" name="destinationLocationCode" placeholder="Destination"
              value={formData.destinationLocationCode} onChange={handleChange} required />
            <input type="date" name="departureDate" value={formData.departureDate} onChange={handleChange} required />
            <input type="date" name="returnDate" value={formData.returnDate} onChange={handleChange} />
            <input type="number" name="adults" placeholder="Adults" value={formData.adults} onChange={handleChange}
              min="1" required />
            <input type="number" name="children" placeholder="Children" value={formData.children} onChange={handleChange}
              min="0" />
            <input type="number" name="infants" placeholder="Infants" value={formData.infants} onChange={handleChange}
              min="0" />
            <select name="travelClass" value={formData.travelClass} onChange={handleChange}>
              <option value="ECONOMY">Economy</option>
              <option value="PREMIUM_ECONOMY">Premium Economy</option>
              <option value="BUSINESS">Business</option>
              <option value="FIRST">First</option>
            </select>
            <label style={{ color: 'black' }}>
              Non-Stop:
              <input type="checkbox" name="nonStop" checked={formData.nonStop} onChange={handleChange} />
            </label>
            <input type="number" name="maxPrice" placeholder="Max Price" value={formData.maxPrice}
              onChange={handleChange} />
            <button type="submit">Search Flights</button>
          </form>
        </div>
        <a href="#" className={styles.buttonLink} onClick={handleViewMyBookings}>
          View My Bookings
        </a>

        <div className={styles.resultsSection}>
          {loading && <p>Loading...</p>}
          {results.length > 0 && (
            <div className={styles.resultsSection}>
              <h3>Flight Offers</h3>
              {results.map((offer) => (
                <div key={offer.id} className={styles.flightOffer}>
                  <p><strong>Price:</strong> {offer.price.total} {offer.price.currency}</p>
                  <p><strong>Departure:</strong> {offer.itineraries[0].segments[0].departure.at}</p>
                  <p><strong>Arrival:</strong> {offer.itineraries[0].segments.slice(-1)[0].arrival.at}</p>
                  <p><strong>Airline:</strong> {offer.itineraries[0].segments[0].carrierCode}</p>
                  <button onClick={() => handleOfferClick(offer)}>Book Now</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedOffer && (
          <Modal open={isModalOpen} onClose={handleCloseModal}>
            <div className={styles.modalContent}>
              <h3>Confirm Your Booking</h3>
              <p><strong>Price:</strong> {selectedOffer?.price.total} {selectedOffer?.price.currency}</p>
              <p><strong>Departure:</strong> {selectedOffer?.itineraries[0].segments[0].departure.at}</p>
              <p><strong>Arrival:</strong> {selectedOffer?.itineraries[0].segments.slice(-1)[0].arrival.at}</p>
              <Button variant="contained" color="primary" onClick={handleConfirmBooking}>Confirm Booking</Button>
            </div>
          </Modal>
        )}

        {/* {isBookingConfirmed && (
        <div>
          <p>Your booking has been confirmed!</p>
          <button onClick={handleViewMyBookings}>View My Bookings</button>
        </div>
      )} */}
      </div>
      <Footer />
    </div>
  );
};

export default BookingForm;
