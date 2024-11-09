import React from 'react';
// import './BookingModal.css'; // Add styles for the modal

const BookingModal = ({ offer, onClose, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Booking Confirmation</h2>
        <p><strong>Price:</strong> {offer.price.total} {offer.price.currency}</p>
        <p><strong>Departure:</strong> {offer.itineraries[0].segments[0].departure.at}</p>
        <p><strong>Arrival:</strong> {offer.itineraries[0].segments.slice(-1)[0].arrival.at}</p>
        <p><strong>Airline:</strong> {offer.itineraries[0].segments[0].carrierCode}</p>

        <button onClick={onConfirm}>Confirm Booking</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default BookingModal;
