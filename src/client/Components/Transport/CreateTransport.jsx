import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./CreateTransport.module.css";
import Footer from "/src/client/Components/Footer/Footer";
import Header from "../Header/Header";

const CreateTransport = () => {
  const location = useLocation();
  const { userId } = location.state;
  const advertiserId = userId;

  const [transportData, setTransportData] = useState({
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",  
    typeOfTransportation: "Bus",
    location: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransportData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("advertiserId:", advertiserId);
    try {
      await axios.post("http://localhost:3000/transport/transports", {
        ...transportData,
        advertiserId,
      });
      alert("Transport created successfully");
    } catch (error) {
      console.error("Error creating transport:", error);
      alert("Failed to create transport");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Departure Date:
            <input
              type="date"
              name="departureDate"
              value={transportData.departureDate}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Departure Time:
            <input
              type="time"
              name="departureTime"
              value={transportData.departureTime}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Arrival Date:
            <input
              type="date"
              name="arrivalDate"
              value={transportData.arrivalDate}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Arrival Time:
            <input
              type="time"
              name="arrivalTime"
              value={transportData.arrivalTime}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Type of Transportation:
            <select
              name="typeOfTransportation"
              value={transportData.typeOfTransportation}
              onChange={handleInputChange}
              required
              className={styles.input}
            >
              <option value="Bus">Bus</option>
              <option value="Train">Train</option>
              <option value="Car">Car</option>
              <option value="Boat">Boat</option>
            </select>
          </label>

          <label className={styles.label}>
            Location:
            <input
              type="text"
              name="location"
              value={transportData.location}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </label>

          <button type="submit" className={styles.button}>Create Transport</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CreateTransport;
