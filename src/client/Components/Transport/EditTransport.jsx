import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./EditTransport.module.css";
import Footer from "/src/client/Components/Footer/Footer";
import Header from "../Header/Header";
import { FaBus, FaEdit, FaTrash, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTimes, FaUsers } from 'react-icons/fa';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditTransport = () => {
  const location = useLocation();
  const { userId } = location.state;
  const advertiserId = userId;

  const [transports, setTransports] = useState([]);
  const [editTransport, setEditTransport] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",
    typeOfTransportation: "Bus",
    departureLocation: "",
    arrivalLocation: "",
  });

  useEffect(() => {
    fetchTransports();
  }, []);

  const fetchTransports = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/transport/transports/advertiser/${advertiserId}`
      );
      setTransports(response.data);
    } catch (error) {
      console.error("Error fetching transports:", error);
      setMessage("Error loading transports. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEdit = (transport) => {
    setEditTransport(transport);
    setFormData({
      departureDate: transport.departureDate,
      departureTime: transport.departureTime,
      arrivalDate: transport.arrivalDate,
      arrivalTime: transport.arrivalTime,
      typeOfTransportation: transport.typeOfTransportation,
      departureLocation: transport.departureLocation,
      arrivalLocation: transport.arrivalLocation,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/transport/transports/${editTransport._id}`,
        {
          ...formData,
          advertiserId,
        }
      );
      setMessage("Transport updated successfully!");
      setMessageType("success");
      setEditTransport(null);
      fetchTransports();
    } catch (error) {
      console.error("Error updating transport:", error);
      setMessage("Failed to update transport. Please try again.");
      setMessageType("error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transport?")) {
      try {
        await axios.delete(`/transport/transports/${id}`);
        setMessage("Transport deleted successfully!");
        setMessageType("success");
        fetchTransports();
      } catch (error) {
        console.error("Error deleting transport:", error);
        setMessage("Failed to delete transport");
        setMessageType("error");
      }
    }
  };

  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <Header />
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>Loading your transports...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <main className={styles.mainContent}>
        <div className="container">
          <div className={styles.dashboardCard}>
            <div className={styles.cardHeader} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <FaBus className={styles.headerIcon} />
              <h2>Manage Your Transports</h2>
              <p className={styles.headerDescription}>
                Edit and manage your transportation listings
              </p>
            </div>

            {message && (
              <div className={`${styles.alert} ${styles[messageType]}`}>
                {message}
              </div>
            )}

            {transports.length === 0 ? (
              <div className={styles.emptyState}>
                <FaBus className={styles.emptyIcon} />
                <h3>No Transports Found</h3>
                <p>You haven't added any transports yet.</p>
              </div>
            ) : (
              <div className={styles.transportGrid}>
                {transports.map((transport) => (
                  <div key={transport._id} className={styles.transportCard}>
                    <div className={styles.transportType}>
                      <FaBus className={styles.transportIcon} />
                      <h3>{transport.typeOfTransportation}</h3>
                    </div>
                    
                    <div className={styles.transportDetails}>
                      <div className={styles.detail}>
                        <FaMapMarkerAlt className={styles.detailIcon} />
                        <div>
                          <strong>From:</strong> {transport.departureLocation}
                        </div>
                      </div>
                      
                      <div className={styles.detail}>
                        <FaMapMarkerAlt className={styles.detailIcon} />
                        <div>
                          <strong>To:</strong> {transport.arrivalLocation}
                        </div>
                      </div>
                      
                      <div className={styles.detail}>
                        <FaCalendarAlt className={styles.detailIcon} />
                        <div>
                          <strong>Departure:</strong>
                          <div>{transport.departureDate} at {transport.departureTime}</div>
                        </div>
                      </div>
                      
                      <div className={styles.detail}>
                        <FaCalendarAlt className={styles.detailIcon} />
                        <div>
                          <strong>Arrival:</strong>
                          <div>{transport.arrivalDate} at {transport.arrivalTime}</div>
                        </div>
                      </div>

                      <div className={styles.detail}>
                        <FaUsers className={styles.detailIcon} />
                        <div>
                          <strong>Bookings:</strong> {transport.numberOfTourists || 0}
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.transportActions}>
                      <button
                        onClick={() => handleEdit(transport)}
                        className={styles.editButton}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(transport._id)}
                        className={styles.deleteButton}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {editTransport && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h3>Edit Transport</h3>
                <button
                  onClick={() => setEditTransport(null)}
                  className={styles.closeButton}
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleUpdate} className={styles.modalForm}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className={styles.formGroup}>
                      <label>
                        <FaCalendarAlt /> Departure Date
                      </label>
                      <input
                        type="date"
                        name="departureDate"
                        value={formData.departureDate}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className={styles.formGroup}>
                      <label>
                        <FaClock /> Departure Time
                      </label>
                      <input
                        type="time"
                        name="departureTime"
                        value={formData.departureTime}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className={styles.formGroup}>
                      <label>
                        <FaCalendarAlt /> Arrival Date
                      </label>
                      <input
                        type="date"
                        name="arrivalDate"
                        value={formData.arrivalDate}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className={styles.formGroup}>
                      <label>
                        <FaClock /> Arrival Time
                      </label>
                      <input
                        type="time"
                        name="arrivalTime"
                        value={formData.arrivalTime}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className={styles.formGroup}>
                      <label>
                        <FaBus /> Type of Transportation
                      </label>
                      <select
                        name="typeOfTransportation"
                        value={formData.typeOfTransportation}
                        onChange={handleInputChange}
                        className={styles.select}
                        required
                      >
                        <option value="Bus">Bus</option>
                        <option value="Train">Train</option>
                        <option value="Car">Car</option>
                        <option value="Boat">Boat</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className={styles.formGroup}>
                      <label>
                        <FaMapMarkerAlt /> Departure Location
                      </label>
                      <input
                        type="text"
                        name="departureLocation"
                        value={formData.departureLocation}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className={styles.formGroup}>
                      <label>
                        <FaMapMarkerAlt /> Arrival Location
                      </label>
                      <input
                        type="text"
                        name="arrivalLocation"
                        value={formData.arrivalLocation}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className={styles.modalActions}>
                      <button type="submit" className={styles.saveButton}>
                        <FaEdit /> Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditTransport(null)}
                        className={styles.cancelButton}
                      >
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default EditTransport;

