import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const BookTransport = () => {
  const location = useLocation();
  const { userId } = location.state;

  const [transports, setTransports] = useState([]);

  useEffect(() => {
    fetchTransports();
  }, []);

  const fetchTransports = async () => {
    try {
      const response = await axios.get("http://localhost:3000/transport/transports");
      setTransports(response.data);
    } catch (error) {
      console.error("Error fetching transports:", error);
    }
  };

  const toggleBooking = async (transport) => {
    const isBooked = transport.tourists.includes(userId);
    const updatedTourists = isBooked
      ? transport.tourists.filter((id) => id !== userId)
      : [...transport.tourists, userId];

    try {
      await axios.put(`http://localhost:3000/transport/transports/${transport._id}`, {
        tourists: updatedTourists,
      });
      setTransports((prevTransports) =>
        prevTransports.map((t) =>
          t._id === transport._id ? { ...t, tourists: updatedTourists } : t
        )
      );
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking");
    }
  };

  return (
    <div>
      <h1>Available Transports</h1>
      <ul>
        {transports.map((transport) => (
          <li key={transport._id}>
            <p>
              {transport.departureDate} - {transport.departureTime} to{" "}
              {transport.arrivalDate} - {transport.arrivalTime} (
              {transport.typeOfTransportation}) at {transport.location}
            </p>
            <button onClick={() => toggleBooking(transport)}>
              {transport.tourists.includes(userId) ? "Booked" : "Book Now"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookTransport;
