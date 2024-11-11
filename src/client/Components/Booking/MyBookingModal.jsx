import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./MyBookingModal.module.css";

const MyBookingModal = ({
  userId,
  isOpen,
  onRequestClose,
  bookingType,
  bookingId,
}) => {
  const [bookingDate, setBookingDate] = useState("");
  const [bookingHour, setBookingHour] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleConfirm = async () => {
    const bookingData = { tourist: userId, bookingDate, bookingHour };

    try {
      var response = null;
      if (bookingType === "itinerary" || bookingType === "activity") {
        bookingData[bookingType] = bookingId;
        console.log("Booking created:", bookingData);

        response = await axios.post(
          "http://localhost:3000/tourist/bookings",
          bookingData
        );
      } else if (bookingType === "historicalPlace") {
        bookingData.historicalPlace = bookingId;
        console.log("Booking created:", bookingData);

        response = await axios.post(
          "http://localhost:3000/tourist/bookings/historicalPlace",
          bookingData
        );
      }
      console.log("Booking created:", response.data);
      onRequestClose();
      navigate("/mybookings", { state: { userId } });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.message);
      } else {
        console.error("Error creating booking:", error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Book {bookingType}</h2>

        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

        {bookingType === "historicalPlace" && (
          <div>
            <label>Booking Hour:</label>
            <input
              type="time"
              value={bookingHour}
              onChange={(e) => setBookingHour(e.target.value)}
              step="3600" // This ensures the time input is in 24-hour format with hourly steps
            />
          </div>
        )}
        <div>
          <label className={styles.bookdate}>Booking Date:</label>
          <input
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
          />
        </div>

        <button
          className={`${styles.modalButton} ${styles.confirmButton}`}
          onClick={handleConfirm}
        >
          Confirm
        </button>
        <button
          className={`${styles.modalButton} ${styles.cancelButton}`}
          onClick={onRequestClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default MyBookingModal;
