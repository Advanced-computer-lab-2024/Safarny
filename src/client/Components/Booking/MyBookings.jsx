import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./MyBookings.module.css";
import Header from "/src/client/components/Header/Header";
import Footer from "/src/client/components/Footer/Footer";
import axios from "axios";
import { CircularProgress } from "@mui/material";

const MyBookings = () => {
  const location = useLocation();
  const { userId } = location.state || {};
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
          `http://localhost:3000/tourist/bookings/${userId}`
      );
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBookings();
    }
  }, [userId]);

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
      fetchBookings(); // Refresh bookings after canceling
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

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
              {bookings.map((booking) => (
                  <li key={booking._id} className={styles.bookingCard}>
                    <div className={styles.bookingDetails}>
                      <p>Booking Date: {booking.bookingDate}</p>
                      {booking.itinerary && <p>Itinerary: {booking.itinerary.name}</p>}
                      {booking.activity && <p>Activity: {booking.activity.location}</p>}
                      {booking.historicalPlace && (
                          <p>Historical Place: {booking.historicalPlace.description}</p>
                      )}
                      {booking.historicalPlace && (
                          <p>Historical Place price: {booking.historicalPlace.ticketPrices}</p>
                      )}
                      <p className={`${styles.bookingStatus} ${styles[booking.status]}`}>
                        Status: {booking.status}
                      </p>
                      {booking.status === "active" && (
                          <button
                              onClick={() => handleCancelBooking(booking)}
                              className={styles.cancelButton}
                          >
                            Cancel Booking
                          </button>
                      )}
                    </div>
                  </li>
              ))}
            </ul>
        )}
        <Footer />
      </div>
  );
};

export default MyBookings;