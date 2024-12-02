import React, { useState } from "react";
import styles from "./CheckoutModal.module.css";

const CheckoutModal = ({ isOpen, onRequestClose, onCheckout }) => {
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleCheckout = () => {
    if (!name || !cardNumber || !expiryDate || !cvv) {
      alert("Please fill out all fields.");
      return;
    }

    const checkoutData = {
      name,
      cardNumber,
      expiryDate,
      cvv,
    };

    console.log("Checkout Data:", checkoutData);
    onCheckout(checkoutData);
    onRequestClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Checkout</h2>

        <div className={styles.inputGroup}>
          <label htmlFor="name" className={styles.label}>Full Name:</label>
          <input
            type="text"
            id="name"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="cardNumber" className={styles.label}>Card Number:</label>
          <input
            type="text"
            id="cardNumber"
            className={styles.input}
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="1234 5678 9101 1121"
            maxLength="16"
          />
        </div>

        <div className={styles.inputRow}>
          <div className={styles.inputGroup}>
            <label htmlFor="expiryDate" className={styles.label}>Expiry Date:</label>
            <input
              type="month"
              id="expiryDate"
              className={styles.input}
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="cvv" className={styles.label}>CVV:</label>
            <input
              type="password"
              id="cvv"
              className={styles.input}
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="123"
              maxLength="3"
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.modalButton} ${styles.confirmButton}`}
            onClick={handleCheckout}
          >
            Confirm Payment
          </button>
          <button
            className={`${styles.modalButton} ${styles.cancelButton}`}
            onClick={onRequestClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
