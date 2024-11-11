import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./MyBookings.module.css";
import Header from "/src/client/components/Header/Header";
import Footer from "/src/client/components/Footer/Footer";
import axios from "axios";
import { CircularProgress, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import mongoose from "mongoose";

const MyBookings = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Added navigate hook
  const { userId } = location.state || {};
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [walletCurrency, setWalletCurrency] = useState("USD");
  const [exchangeRates, setExchangeRates] = useState({});
  const [tourGuideRatings, setTourGuideRatings] = useState({});

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/tourist/bookings/${userId}`);
      const bookingsWithTourGuide = await Promise.all(
        response.data.map(async (booking) => {
          try {
            let tourGuideUsername = null;
            let tourGuideId = null;

            if (booking.itinerary && booking.itinerary._id) {
              const itineraryResponse = await axios.get(`http://localhost:3000/itineraries/${booking.itinerary._id}`);
              tourGuideId = itineraryResponse.data.createdby;
            } else if (booking.activity && booking.activity._id) {
              const activityResponse = await axios.get(`http://localhost:3000/activities/${booking.activity._id}`);
              tourGuideId = activityResponse.data.createdby;
            }

            if (tourGuideId) {
              try {
                const tourGuideResponse = await axios.get(`http://localhost:3000/tourist/${tourGuideId}`);
                tourGuideUsername = tourGuideResponse.data.username;
              } catch (error) {
                if (error.response && error.response.status === 404) {
                  console.error(`Tour guide profile not found for ID ${tourGuideId}`);
                } else {
                  throw error;
                }
              }
            }

            return { ...booking, tourGuideUsername, tourGuideId, rating: 5 };
          } catch (error) {
            console.error(`Error fetching details for booking ${booking._id || "unknown"}:`, error);
            return { ...booking, tourGuideUsername: "Unknown", tourGuideId: null, rating: 5 };
          }
        })
      );
      setBookings(bookingsWithTourGuide);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_EXCHANGE_API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!data.conversion_rates) {
        throw new Error("Invalid data format");
      }
      setExchangeRates(data.conversion_rates);
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
      setExchangeRates({ USD: 1 });
    }
  };

  const convertPrice = (price, fromCurrency, toCurrency) => {
    if (price == null) {
      return "N/A";
    }
    const rateFrom = exchangeRates[fromCurrency] || 1;
    const rateTo = exchangeRates[toCurrency] || 1;
    return ((price / rateFrom) * rateTo).toFixed(2);
  };

  const handleRatingChange = async (bookingId, rating, bookingType, bookingTypeId) => {
    try {
      let endpoint = "";
      if (bookingType === "itinerary") {
        endpoint = `http://localhost:3000/itineraries/updaterating/${bookingTypeId}`;
      } else if (bookingType === "activity") {
        endpoint = `http://localhost:3000/activities/updaterating/${bookingTypeId}`;
      } else if (bookingType === "historicalPlace") {
        endpoint = `http://localhost:3000/historicalplaces/updaterating/${bookingTypeId}`;
      }

      await axios.put(endpoint, { rating });
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId ? { ...booking, rating } : booking
        )
      );
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  const handleTourGuideRatingChange = async (tourGuideId, rating) => {
    try {
      const stringTourGuideId = String(tourGuideId);
      if (!/^[a-fA-F0-9]{24}$/.test(stringTourGuideId)) {
        throw new Error("Invalid tour guide ID");
      }
      await axios.put(`http://localhost:3000/tourguide/updaterating/`, { id: stringTourGuideId, newRating: rating });
      setTourGuideRatings((prevRatings) => ({
        ...prevRatings,
        [stringTourGuideId]: rating,
      }));
    } catch (error) {
      console.error("Error updating tour guide rating:", error);
    }
  };

  const handleCancelBooking = async (booking) => {
    try {
      if (booking.historicalPlace) {
        await axios.put(
          `http://localhost:3000/tourist/bookings/${booking._id}/cancel/historicalPlace`
        );
      } else if (booking.activity) {
        await axios.put(
          `http://localhost:3000/tourist/bookings/${booking._id}/cancel`
        );
      } else if (booking.itinerary) {
        await axios.put(
          `http://localhost:3000/tourist/bookings/${booking._id}/cancel`
        );
      }
      fetchBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const isPastDate = (date) => {
    return new Date(date) < new Date();
  };

  // Button handlers for navigation
  const handleNavigateToCommentForTourGuide = (booking) => {
    navigate(`/create-comment-tourguide/${booking.tourGuideId}`, { state: { bookingId: booking._id } });
  };

  const handleNavigateToCommentForItinerary = (booking) => {
    navigate(`/create-comment-itinerary/${booking.itinerary._id}`, { state: { bookingId: booking._id } });
  };

  const handleNavigateToCommentForActivity = (booking) => {
    navigate(`/create-comment-activity/${booking.activity._id}`, { state: { bookingId: booking._id } });
  };

  useEffect(() => {
    if (userId) {
      fetchBookings();
      fetchExchangeRates();
    }
  }, [userId]);

  return (
    <div className={styles.container}>
      <Header />
      <h1>My Bookings</h1>

      {loading ? (
        <div className={styles.loadingContainer}>
          <CircularProgress />
        </div>
      ) : bookings.length === 0 ? (
        <p className={styles.noBookingsText}>No bookings found.</p>
      ) : (
        <ul className={styles.bookingList}>
          {bookings.map((booking) => {
            const bookingType = booking.itinerary
              ? "itinerary"
              : booking.activity
              ? "activity"
              : booking.historicalPlace
              ? "historicalPlace"
              : null;

            const bookingTypeId = booking.itinerary && booking.itinerary._id
              ? booking.itinerary._id
              : booking.activity && booking.activity._id
              ? booking.activity._id
              : booking.historicalPlace && booking.historicalPlace._id
              ? booking.historicalPlace._id
              : null;

            const tourGuideInfo = `Tour Guide: ${booking.tourGuideUsername}`;

            return (
              <li key={booking._id} className={styles.bookingCard}>
                <div className={styles.bookingDetails}>
                  <p>Booking Date: {booking.bookingDate}</p>
                  {booking.itinerary && <p>Itinerary: {booking.itinerary.name}</p>}
                  {booking.activity && <p>Activity: {booking.activity.location}</p>}
                  {booking.historicalPlace && (
                    <p>Historical Place: {booking.historicalPlace.description}</p>
                  )}
                  {booking.historicalPlace && (
                    <p>
                      Historical Place price:{" "}
                      {convertPrice(
                        booking.historicalPlace.ticketPrices,
                        booking.historicalPlace.currency,
                        walletCurrency
                      )}{" "}
                      {walletCurrency}
                    </p>
                  )}

                  {booking.tourGuideId && booking.tourGuideUsername && (
                    <>
                      <p>{tourGuideInfo}</p>
                      {isPastDate(booking.bookingDate) && (
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Rate this tour guide</InputLabel>
                          <Select
                            value={tourGuideRatings[booking.tourGuideId] || 5}
                            onChange={(e) =>
                              handleTourGuideRatingChange(booking.tourGuideId, e.target.value)
                            }
                          >
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <MenuItem key={rating} value={rating}>
                                {rating}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    </>
                  )}

                  {isPastDate(booking.bookingDate) && <p>Status: Finished</p>}
                  {!isPastDate(booking.bookingDate) && (
                    <p className={`${styles.bookingStatus} ${styles[booking.status]}`}>
                      Status: {booking.status}
                    </p>
                  )}

                  {/* New button logic for navigation */}
                  {booking.status === "confirmed" && booking.itinerary && (
                    <>
                      <button onClick={() => handleNavigateToCommentForTourGuide(booking)}>
                        Comment on Tour Guide
                      </button>
                      <button onClick={() => handleNavigateToCommentForItinerary(booking)}>
                        Comment on Itinerary
                      </button>
                    </>
                  )}

                  {booking.status === "confirmed" && booking.activity && (
                    <button onClick={() => handleNavigateToCommentForActivity(booking)}>
                      Comment on Activity
                    </button>
                  )}

                  {booking.status === "active" && (
                    <button
                      onClick={() => handleCancelBooking(booking)}
                      className={styles.cancelButton}
                    >
                      Cancel Booking
                    </button>
                  )}

                  {isPastDate(booking.bookingDate) && (
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Rate this booking</InputLabel>
                      <Select
                        value={booking.rating}
                        onChange={(e) => handleRatingChange(booking._id, e.target.value, bookingType, bookingTypeId)}
                      >
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <MenuItem key={rating} value={rating}>
                            {rating}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <Footer />
    </div>
  );
};

export default MyBookings;
