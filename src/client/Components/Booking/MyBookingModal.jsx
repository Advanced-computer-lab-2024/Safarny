import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PaymentModal from "./PaymentModal";
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
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const navigate = useNavigate();


  const GoToPaymentModal = () => {
    setIsPaymentModalOpen(true);
  };

  if (!isOpen) return null;

  return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h2 className={styles.modalTitle}>Book {bookingType}</h2>

          {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

          {bookingType === "historicalPlace" && (
              <div>
                <label className={styles.hour}>Booking Hour:</label>
                <input
                    type="time"
                    value={bookingHour}
                    onChange={(e) => setBookingHour(e.target.value)}
                    step="3600" // This ensures the time input is in 24-hour format with hourly steps
                />
              </div>
          )}
          <br></br>
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
              onClick={GoToPaymentModal}
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
        <PaymentModal
            isOpen={isPaymentModalOpen}
            onRequestClose={() => setIsPaymentModalOpen(false)}
            addresses={[]} // Pass the necessary addresses here
        />
      </div>
  );
};

export default MyBookingModal;