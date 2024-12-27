import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { FaBus, FaPlane, FaTrain, FaClock, FaMapMarkerAlt, FaCalendar, FaUsers, FaShip } from "react-icons/fa";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import styles from "./BookTransport.module.css";

const BookTransport = () => {
  const location = useLocation();
  const { userId } = location.state;
  const [transports, setTransports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransports();
  }, []);

  const fetchTransports = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/transport/transports");
      setTransports(response.data);
    } catch (error) {
      console.error("Error fetching transports:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTransportIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'plane': return <FaPlane />;
      case 'train': return <FaTrain />;
      case 'boat': return <FaShip />;
      default: return <FaBus />;
    }
  };

  const toggleBooking = async (transport) => {
    const isBooked = transport.tourists.includes(userId);
    const updatedTourists = isBooked
      ? transport.tourists.filter((id) => id !== userId)
      : [...transport.tourists, userId];

    try {
      await axios.put(`/transport/transports/${transport._id}`, {
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
    <div className={`${styles.pageWrapper} min-vh-100 d-flex flex-column`}>
      <Header />
      
      <main className="flex-grow-1">
        {/* <div className={styles.heroSection}> */}
          <div className="container text-center text-white">
            <h1 className="display-4 mb-3">Transportation Services</h1>
            {/* <p className="lead mb-0">Find and book your perfect travel option</p> */}
          </div>
        {/* </div> */}

        <div className="container py-5">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
              <p className="mt-3 text-muted">Loading available transportation...</p>
            </div>
          ) : transports.length > 0 ? (
            <div className="row g-4">
              {transports.map((transport) => (
                <div key={transport._id} className="col-md-6">
                  <div className={`${styles.transportCard} card h-100 shadow-sm`}>
                    <div className="card-body">
                      <div className={styles.transportHeader}>
                        <span className={styles.transportIcon}>
                          {getTransportIcon(transport.typeOfTransportation)}
                        </span>
                        <h5 className="card-title mb-3">{transport.typeOfTransportation}</h5>
                      </div>

                      <div className={styles.routeInfo}>
                        <div className="mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <FaMapMarkerAlt className="text-primary me-2" />
                            <strong>From:</strong> {transport.departureLocation}
                          </div>
                          <div className="d-flex align-items-center">
                            <FaMapMarkerAlt className="text-primary me-2" />
                            <strong>To:</strong> {transport.arrivalLocation}
                          </div>
                        </div>

                        <div className={styles.timeInfo}>
                          <div className="mb-2">
                            <FaCalendar className="text-primary me-2" />
                            <strong>Departure:</strong> {transport.departureDate}
                            <FaClock className="ms-2 me-1" />
                            {transport.departureTime}
                          </div>
                          <div>
                            <FaCalendar className="text-primary me-2" />
                            <strong>Arrival:</strong> {transport.arrivalDate}
                            <FaClock className="ms-2 me-1" />
                            {transport.arrivalTime}
                          </div>
                        </div>

                        <div className={styles.passengerInfo}>
                          <FaUsers className="text-primary me-2" />
                          <span>{transport.tourists.length} passengers booked</span>
                        </div>
                      </div>

                      <button
                        className={`btn ${transport.tourists.includes(userId) 
                          ? 'btn-success' 
                          : 'btn-primary'} w-100 mt-3 ${styles.bookButton}`}
                        onClick={() => toggleBooking(transport)}
                      >
                        {transport.tourists.includes(userId) ? "✓ Booked" : "Book Now"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <FaBus className="display-1 text-muted mb-3" />
              <h3>No Transportation Available</h3>
              <p className="text-muted">Check back later for available transportation options.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookTransport;

