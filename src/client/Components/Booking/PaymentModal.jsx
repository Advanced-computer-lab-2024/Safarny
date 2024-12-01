import React, { useState } from "react";
import styles from "./PaymentModal.module.css";

const PaymentModal = ({ isOpen, onRequestClose, addresses }) => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const paymentMethods = ["Wallet","Cash on delivery","Credit card"]
  const handleConfirm = () => {
    if (!selectedAddress || !selectedPaymentMethod) {
      alert("Please select both an address and a payment method.");
      return;
    }

    console.log("Address selected:", selectedAddress);
    console.log("Payment method selected:", selectedPaymentMethod);

    onRequestClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Payment</h2>

        {}
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

        {}
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

        {}
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
      </div>
    </div>
  );
};

export default PaymentModal;
