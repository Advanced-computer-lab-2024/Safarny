import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./PaymentModal.module.css";

const PaymentModal = ({ addresses, userId, isOpen, onRequestClose, bookingType, bookingId, bookingDate, bookingHour }) => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const paymentMethods = ["Wallet", "Cash on delivery", "Credit card"];
  const navigate = useNavigate();

  const handleConfirm = async () => {
    const bookingData = { tourist: userId, bookingDate, bookingHour };
    if (!selectedAddress || !selectedPaymentMethod) {
      alert("Please select both an address and a payment method.");
      return;
    }
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

      // After successful booking, send receipt email
      if (response && response.data) {
        try {
          const emailData = {
            bookingId: response.data._id,
            touristName: response.data.tourist.username,
            touristEmail: response.data.tourist.email,
            itemName: response.data[bookingType]?.name || response.data[bookingType]?.location,
            price: response.data[bookingType]?.price,
            currency: response.data[bookingType]?.currency || 'EGP',
            bookingDate: bookingData.bookingDate,
            type: bookingType.charAt(0).toUpperCase() + bookingType.slice(1),
            pointsEarned: response.data.pointsEarned || 0
          };

          await axios.post('http://localhost:3000/tourist/bookings/send-receipt', emailData);
          console.log('Receipt email sent successfully');
        } catch (error) {
          console.error('Error sending receipt email:', error);
          // Don't throw error here as booking was successful
        }
      }

      console.log("Booking created:", response.data);
      onRequestClose();
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
          <h2 className={styles.modalTitle}>Payment</h2>

          {addresses.length === 0 ? (
              <div>
                <p>No addresses found. Please update your profile to add an address.</p>
                <button
                    className={`${styles.modalButton} ${styles.updateProfileButton}`}
                    onClick={() => navigate("/updateprofile")}
                >
                  Update Profile
                </button>
              </div>
          ) : (
              <>
                <div>
                  <h3 className={styles.sectionTitle}>Choose an Address</h3>
                  <div className={styles.addressList}>
                    {addresses.map((address, index) => (
                        <div
                            key={index}
                            className={`${styles.addressItem} ${
                                selectedAddress === address ? styles.selected : ""
                            }`}
                            onClick={() => setSelectedAddress(address)}
                        >
                          <p>{address}</p>
                        </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className={styles.sectionTitle}>How would you like to pay?</h3>
                  <div className={styles.paymentMethods}>
                    {paymentMethods.map((method, index) => (
                        <div
                            key={index}
                            className={`${styles.paymentOption} ${
                                selectedPaymentMethod === method ? styles.selected : ""
                            }`}
                            onClick={() => setSelectedPaymentMethod(method)}
                        >
                          <input
                              type="radio"
                              id={method}
                              name="paymentMethod"
                              checked={selectedPaymentMethod === method}
                              readOnly
                          />
                          <label htmlFor={method}>{method}</label>
                        </div>
                    ))}
                  </div>
                </div>

                <div className={styles.actions}>
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
              </>
          )}
        </div>
      </div>
  );
};

export default PaymentModal;