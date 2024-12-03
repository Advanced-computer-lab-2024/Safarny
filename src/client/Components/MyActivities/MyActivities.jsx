import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Footer from '/src/client/components/Footer/Footer';
import Header from '/src/client/components/Header/Header';
import Rating from '@mui/material/Rating';
import styles from './MyActivities.module.css';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const MyActivities = () => {
  const location = useLocation();
  const { userId } = location.state || {};
  const [searchParams] = useSearchParams();
  const touristId = userId || localStorage.getItem('userId');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exchangeRates, setExchangeRates] = useState({});
  const [walletCurrency, setWalletCurrency] = useState('EGP');
  const [selectedCurrency, setSelectedCurrency] = useState('EGP');

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_EXCHANGE_API_URL);
        setExchangeRates(response.data.conversion_rates);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
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

    fetchUserRole();
    fetchExchangeRates();
  }, [touristId]);

  const convertPrice = (price, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) {
      return price;
    }
    const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
    return (price * rate).toFixed(2);
  };

  useEffect(() => {
    const fetchUserActivities = async () => {
      try {
        const response = await axios.get(`/tourist/${touristId}`);
        const activityIds = response.data?.activities || [];
        if (activityIds.length > 0) {
          const uniqueActivityDetails = await Promise.all(
            activityIds.map(async (activityId) => {
              try {
                const activityResponse = await axios.get(`/activities/${activityId}`);
                return activityResponse.data;
              } catch (err) {
                if (err.response && err.response.status === 404) {
                  console.warn(`Activity with ID ${activityId} not found.`);
                  return null;
                } else {
                  throw err;
                }
              }
            })
          );

          const validActivities = uniqueActivityDetails.filter(activity => activity !== null);
          setActivities(validActivities);

          if (validActivities.length === 0) {
            setError('No activities found for this user.');
          }
        } else {
          setError('No activities found for this user.');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to fetch activities');
        setLoading(false);
      }
    };

    if (touristId) {
      fetchUserActivities();
    }
  }, [touristId]);

  return (
    <div className={styles.container}>
      <Header />
      <h1 className={styles.headerTitle}>My Activities</h1>
      {loading ? (
        <p>Loading activities...</p>
      ) : activities.length === 0 ? (
        <main className={styles.main}>
          <p>No activities available.</p>
        </main>
      ) : (
        <>
          <FormControl fullWidth margin="normal">
            <InputLabel>Currency</InputLabel>
            <Select value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)}>
              {Object.keys(exchangeRates).map(code => (
                <MenuItem key={code} value={code}>{code}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <div>
            {activities.map(activity => {
              const convertedPrice = convertPrice(activity.price, activity.currency, selectedCurrency);
              return (
                <div className={styles.activityCard} key={activity._id}>
                  <h3>{activity.name}</h3>
                  <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
                  <p>Time: {activity.time}</p>
                  <p>Location: {activity.location}</p>
                  {activity.tags && activity.tags.length > 0 && (
                    <p>Tags: {activity.tags.map((tag) => tag.name).join(", ")}</p>
                  )}
                  {activity.category && activity.category.length > 0 && (
                    <p>Category: {activity.category.map((cat) => cat.type).join(", ")}</p>
                  )}
                  <p style={{ color: activity.bookingOpen ? "green" : "red" }}>
                    {activity.bookingOpen ? "Booking: Open" : "Booking: Closed"}
                  </p>
                  <p>Price: {convertedPrice} {selectedCurrency}</p>
                  <p>
                    <strong>Rating:</strong>
                    <Rating value={activity.averageRating} readOnly />
                  </p>
                  <img className={styles.activityImage} src={activity.imageUrl} alt={activity.name} />
                </div>
              );
            })}
          </div>
        </>
      )}
      <Footer />
    </div>
  );
};

export default MyActivities;
