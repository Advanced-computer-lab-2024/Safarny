import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './MyFlights.module.css'; // Import the CSS module

const MyBookedFlights = () => {
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const bookedBy = location.state?.bookedBy;

  const getMyBookings = async (bookedBy) => {
    try {
      const response = await fetch(`/tourist/getBookFlight/${bookedBy}`);
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useEffect(() => {
    if (bookedBy) {
      getMyBookings(bookedBy);
    }
  }, [bookedBy]);

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>My Booked Flights</h2>
      {bookings.length > 0 ? (
        <div className={styles.cardContainer}>
          {bookings.map((booking) => (
            <div key={booking._id} className={styles.card}>
              <p className={styles.text}><strong>Flight Number:</strong> {booking.aircraft}</p>
              <p className={styles.text}><strong>Departure:</strong> {booking.DepartureDate}</p>
              <p className={styles.text}><strong>Arrival:</strong> {booking.ArrivalDate}</p>
              <p className={styles.text}><strong>Origin Location:</strong> {booking.originLocationCode}</p>
              <p className={styles.text}><strong>Destination1 Location:</strong> {booking.destinationLocationCode}</p>
              <p className={styles.text}><strong>Final Destination:</strong> {booking.destinationLocationCode2}</p>
              <p className={styles.text}><strong>Number Of Adults:</strong> {booking.adults}</p>
              <p className={styles.text}><strong>Number Of Children:</strong> {booking.children}</p>
              <p className={styles.text}><strong>Number Of Infants:</strong> {booking.infants}</p>
              <p className={styles.text}><strong>Travel Class:</strong> {booking.travelClass}</p>
              <p className={styles.text}><strong>Non Stop:</strong> {booking.nonStop ? "Yes" : "No"}</p>
              <p className={styles.text}><strong>Price:</strong> {booking.Price} Euro</p>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.noBookingsText}>No bookings found.</p>
      )}
    </div>
  );
};

export default MyBookedFlights;
