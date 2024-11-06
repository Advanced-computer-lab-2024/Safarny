import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button } from '@mui/material';
import { useLocation,useNavigate } from 'react-router-dom';

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
      const url = `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${hotel.hotelId}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setOfferDetails(response.data.data[0]); // Assuming the first offer is of interest
    } catch (error) {
      console.error('Error fetching hotel offers:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOffer(null);
    setOfferDetails(null);
  };
  const handleBooking = async() => {
    const params={
      touristId: bookedBy,
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
    <div>
      <h2>Hotel Booking</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>City Code</label>
          <input
            type="text"
            name="cityCode"
            value={formData.cityCode}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Radius</label>
          <input
            type="number"
            name="radius"
            value={formData.radius}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Radius Unit</label>
          <select name="radiusUnit" value={formData.radiusUnit} onChange={handleChange}>
            {radiusUnits.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>

          <label>Amenities</label>
          <select name="amenities" value={formData.amenities} onChange={handleChange}>
            {amenitiesOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <label>Rating</label>
          <select name="ratings" value={formData.ratings} onChange={handleChange}>
            {ratingsOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search Hotels'}
        </button>
      </form>

      <div>
        <h3>Hotel Results</h3>
        {hotels.length > 0 ? (
          <ul>
            {hotels.map((hotel) => (
              <li key={hotel.hotelId}>
                <h4>{hotel.name}</h4>
                <Button onClick={() => handleOfferClick(hotel)}>View Offers</Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No results found.</p>
        )}
      </div>
      <Button onClick={handleViewMyBooking}>View My Bookings</Button>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <div className="modal-content">
          <h2>Hotel Offer Details</h2>
          {selectedOffer && (
            <>
              <h4>Hotel Name: {selectedOffer.name}</h4>
              <h4>Hotel ID: {selectedOffer.hotelId}</h4>
            </>
          )}
          {offerDetails ? (
            <>
              <h4>Price: {offerDetails.offers[0].price.total} {offerDetails.offers[0].price.currency}</h4>
              <h4>Check-in: {offerDetails.offers[0].checkInDate}</h4>
              <h4>Check-out: {offerDetails.offers[0].checkOutDate}</h4>
              <h4>Distance from center: {selectedOffer.distance.value}{selectedOffer.distance.unit}</h4>
              <h4>Guests Adults{offerDetails.offers[0].guests.adults}</h4>
              {/* <h4>Room Type: {offerDetails.offers[0].room.typeEstimated.category}</h4> */}
              <li>Room Type: {offerDetails.offers[0].room.typeEstimated.category}</li>
              <li>Number Of Beds: {offerDetails.offers[0].room.typeEstimated.beds}</li>
              <li>Bed Type: {offerDetails.offers[0].room.typeEstimated.bedType}</li>
              <h4>Offer Description : {offerDetails.offers[0].room.description.text}</h4>
              {/* Add other offer details here as needed */}
            </>
          ) : (
            <p>Loading offer details...</p>
          )}
          <Button onClick={handleCloseModal}>Close</Button>
          <Button onClick={handleBooking}>Book</Button>
        </div>
      </Modal>
    </div>
  );
};

export default BookingHotel;
