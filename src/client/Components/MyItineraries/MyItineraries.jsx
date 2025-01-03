import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Footer from '/src/client/Components/Footer/Footer';
import Header from '/src/client/Components/Header/Header';
import styles from './MyItineraries.module.css';
import { Rating } from "@mui/material";


const MyItineraries = () => {
  const location = useLocation();
  const { userId } = location.state || {};
  const [searchParams] = useSearchParams();
  const touristId = userId || localStorage.getItem('userId');
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exchangeRates, setExchangeRates] = useState({});
  const [walletCurrency, setWalletCurrency] = useState('EGP');
  const [selectedCurrency, setSelectedCurrency] = useState('EGP');


  useEffect(() => {

    const fetchUserItineraries = async () => {
      try {
        const response = await axios.get(`/tourist/${touristId}`);
        console.log("User response:", response);
        const itineraryIds = response.data?.itineraries|| []; // Get itinerary IDs
        if (itineraryIds.length > 0) {
          const uniqueItineraryDetails = await Promise.all(
            itineraryIds.map(async (itineraryId) => {
              try {
                const itineraryResponse = await axios.get(`/itineraries/${itineraryId}`);
                return itineraryResponse.data;
              } catch (err) {
                if (err.response && err.response.status === 404) {
                  console.warn(`Itinerary with ID ${itineraryId} not found.`);
                  return null;
                } else {
                  throw err;
                }
              }
            })
          );

          const validItineraries = uniqueItineraryDetails.filter(itinerary => itinerary !== null);
          setItineraries(validItineraries);

          if (validItineraries.length === 0) {
            setError('No itineraries found for this user.');
          }
        } else {
          setError('No itineraries found for this user.');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching itineraries:', err);
        setError('Failed to fetch itineraries');
        setLoading(false);
      }
    };
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(`/tourist/${touristId}`);
        const user = response.data;
        setWalletCurrency(user.walletcurrency || 'EGP');
        setSelectedCurrency(user.walletcurrency || 'EGP');
      } catch (err) {
        console.error('Error fetching user role:', err);
      }
    };
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_EXCHANGE_API_URL);
        setExchangeRates(response.data.conversion_rates);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };
    if (touristId) {
      fetchUserItineraries();
      fetchExchangeRates();
      fetchUserRole();
    }
  }, [touristId]);
  const convertPrice = (price, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) {
      return price;
    }
    const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
    return (price * rate).toFixed(2);
  };
  if (loading) {
    return <p>Loading itineraries...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles.container}>
      <Header />
      <h1 className={styles.headerTitle}>My Itineraries</h1>
      {itineraries.length > 0 ? (
        <div >
          {itineraries.map(itinerary => (
              <div className={styles.itineraryCard} key={itinerary._id}>
                <h3>{itinerary.name}</h3>
                <p>Duration: {itinerary.duration} hours</p>
                <p>Language: {itinerary.language}</p>

                {/*Add Price Here.*/}
                <p>
                  Price: {convertPrice(itinerary.price, itinerary.currency, selectedCurrency)} {selectedCurrency}
                </p>


                <p>Available Dates: {itinerary.availableDates.join(", ")}</p>
                <p>Available Times: {itinerary.availableTimes.join(", ")}</p>
                <p>Accessibility: {itinerary.accessibility ? "Yes" : "No"}</p>
                <p>Pickup Location: {itinerary.pickupLocation}</p>
                <p>Dropoff Location: {itinerary.dropoffLocation}</p>
                <p>Rating: <Rating value={Math.round(itinerary.averageRating * 2) / 2} precision={0.5} readOnly/></p>
                {itinerary.tags && itinerary.tags.length > 0 && (
                    <p>
                      Tags: {itinerary.tags.map((tag) => tag.name).join(", ")}
                    </p>
                )}
                {itinerary.activities && itinerary.activities.length > 0 && (
                    <div>
                      <p>Activities:</p>
                      <ul>
                        {itinerary.activities.map((activity) => (
                            <li key={activity._id}>
                              {activity.location} - {activity.date} at{" "}
                              {activity.time}
                              {activity.specialDiscount && (
                                  <span>
                                {" "}
                                    - Discount: {activity.specialDiscount}
                              </span>
                              )}
                              {activity.price && (
                                  <span> - Price: {activity.price}$</span>
                              )}
                            </li>
                        ))}
                      </ul>
                    </div>
                )}
                <img className={styles.itineraryImage} src={itinerary.imageUrl} alt={itinerary.title}/>
              </div>
          ))}
        </div>
      ) : (
          <p>No itineraries available</p>
      )}
      <Footer/>
    </div>
  );
};

export default MyItineraries;
