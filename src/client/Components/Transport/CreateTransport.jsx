import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./CreateTransport.module.css";
import Footer from "/src/client/Components/Footer/Footer";
import Header from "../Header/Header";
import { FaBus, FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateTransport = () => {
  const location = useLocation();
  const { userId } = location.state;
  const advertiserId = userId;
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const [transportData, setTransportData] = useState({
    departureDate: null,
    departureTime: null,
    arrivalDate: null,
    arrivalTime: null,
    typeOfTransportation: "Bus",
    departureLocation: "",
    arrivalLocation: "",
  });

  const handleDateTimeChange = (date, field) => {
    setTransportData(prevData => ({
      ...prevData,
      [field]: date
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransportData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const formatTime = (date) => {
    if (!date) return '';
    return date.toTimeString().slice(0, 5);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate dates
    if (!transportData.departureDate || !transportData.arrivalDate) {
      setMessage("Please select both departure and arrival dates");
      setMessageType("error");
      return;
    }

    try {
      // Format the data for the API
      const formattedData = {
        departureDate: formatDate(transportData.departureDate),
        departureTime: formatTime(transportData.departureDate),
        arrivalDate: formatDate(transportData.arrivalDate),
        arrivalTime: formatTime(transportData.arrivalDate),
        typeOfTransportation: transportData.typeOfTransportation,
        departureLocation: transportData.departureLocation,
        arrivalLocation: transportData.arrivalLocation,
        advertiserId
      };

      console.log('Sending data:', formattedData); // Debug log

      const response = await axios.post(
        "http://localhost:3000/transport/transports", 
        formattedData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        setMessage("Transport created successfully!");
        setMessageType("success");
        // Clear form
        setTransportData({
          departureDate: null,
          arrivalDate: null,
          typeOfTransportation: "Bus",
          departureLocation: "",
          arrivalLocation: "",
        });
      }
    } catch (error) {
      console.error("Error creating transport:", error);
      const errorMessage = error.response?.data?.message || "Failed to create transport. Please try again.";
      setMessage(errorMessage);
      setMessageType("error");
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <main className={styles.mainContent}>
        <div className="container py-4">
          <div className={styles.formCard}>
            <div className={styles.cardHeader}>
              <FaBus className={styles.headerIcon} />
              <h2>Create New Transport</h2>
              <p className={styles.headerDescription}>
                Add a new transportation option for travelers
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className="row g-4 justify-content-center">
                <div className="col-md-6">
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      <FaCalendarAlt className={styles.inputIcon} />
                      Departure Date & Time
                    </label>
                    <DatePicker
                      selected={transportData.departureDate}
                      onChange={(date) => handleDateTimeChange(date, 'departureDate')}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="MMMM d, yyyy h:mm aa"
                      className={styles.input}
                      placeholderText="Select departure date and time"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      <FaCalendarAlt className={styles.inputIcon} />
                      Arrival Date & Time
                    </label>
                    <DatePicker
                      selected={transportData.arrivalDate}
                      onChange={(date) => handleDateTimeChange(date, 'arrivalDate')}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="MMMM d, yyyy h:mm aa"
                      className={styles.input}
                      placeholderText="Select arrival date and time"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      <FaMapMarkerAlt className={styles.inputIcon} />
                      Departure Location
                    </label>
                    <input
                      type="text"
                      name="departureLocation"
                      value={transportData.departureLocation}
                      onChange={handleInputChange}
                      required
                      className={styles.input}
                      placeholder="Enter departure location"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      <FaMapMarkerAlt className={styles.inputIcon} />
                      Arrival Location
                    </label>
                    <input
                      type="text"
                      name="arrivalLocation"
                      value={transportData.arrivalLocation}
                      onChange={handleInputChange}
                      required
                      className={styles.input}
                      placeholder="Enter arrival location"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      <FaBus className={styles.inputIcon} />
                      Type of Transportation
                    </label>
                    <select
                      name="typeOfTransportation"
                      value={transportData.typeOfTransportation}
                      onChange={handleInputChange}
                      required
                      className={styles.select}
                    >
                      <option value="Bus">Bus</option>
                      <option value="Train">Train</option>
                      <option value="Car">Car</option>
                      <option value="Boat">Boat</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <button type="submit" className={styles.submitButton}>
                    Create Transport
                  </button>
                </div>

                {message && (
                  <div className="col-12">
                    <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'} mt-3 text-center`}>
                      {message}
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateTransport;

