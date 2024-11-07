import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

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
      const response = await axios.post(
        "http://localhost:3000/transport/transports",
        {
          ...transportData,
          advertiserId,
        }
      );
      alert("Transport created successfully");
    } catch (error) {
      console.error("Error creating transport:", error);
      alert("Failed to create transport");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Departure Date:
        <input
          type="date"
          name="departureDate"
          value={transportData.departureDate}
          onChange={handleInputChange}
          required
        />
      </label>

      <label>
        Departure Time:
        <input
          type="time"
          name="departureTime"
          value={transportData.departureTime}
          onChange={handleInputChange}
          required
        />
      </label>

      <label>
        Arrival Date:
        <input
          type="date"
          name="arrivalDate"
          value={transportData.arrivalDate}
          onChange={handleInputChange}
          required
        />
      </label>

      <label>
        Arrival Time:
        <input
          type="time"
          name="arrivalTime"
          value={transportData.arrivalTime}
          onChange={handleInputChange}
          required
        />
      </label>

      <label>
        Type of Transportation:
        <select
          name="typeOfTransportation"
          value={transportData.typeOfTransportation}
          onChange={handleInputChange}
          required
        >
          <option value="Bus">Bus</option>
          <option value="Train">Train</option>
          <option value="Car">Car</option>
          <option value="Boat">Boat</option>
        </select>
      </label>

      <label>
        Location:
        <input
          type="text"
          name="location"
          value={transportData.location}
          onChange={handleInputChange}
          required
        />
      </label>

      <button type="submit">Create Transport</button>
    </form>
  );
};

export default CreateTransport;
