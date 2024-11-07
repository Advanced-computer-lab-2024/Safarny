import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const ManageTransports = () => {
  const location = useLocation();
  const { userId } = location.state;
  const advertiserId = userId;

  const [transports, setTransports] = useState([]);
  const [editTransport, setEditTransport] = useState(null);
  const [formData, setFormData] = useState({
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",
    typeOfTransportation: "Bus",
    location: "",
  });

  useEffect(() => {
    fetchTransports();
  }, []);

  const fetchTransports = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/transport/transports?advertiserId=${advertiserId}`
      );
      setTransports(response.data);
    } catch (error) {
      console.error("Error fetching transports:", error);
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
      location: transport.location,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3000/transport/transports/${editTransport._id}`,
        {
          ...formData,
          advertiserId,
        }
      );
      alert("Transport updated successfully");
      setEditTransport(null);
      fetchTransports();
    } catch (error) {
      console.error("Error updating transport:", error);
      alert("Failed to update transport");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/transport/transports/${id}`);
      alert("Transport deleted successfully");
      fetchTransports();
    } catch (error) {
      console.error("Error deleting transport:", error);
      alert("Failed to delete transport");
    }
  };

  return (
    <div>
      <h1>Manage Transports</h1>

      {editTransport ? (
        <form onSubmit={handleUpdate}>
          <h2>Edit Transport</h2>

          <label>
            Departure Date:
            <input
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Departure Time:
            <input
              type="time"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Arrival Date:
            <input
              type="date"
              name="arrivalDate"
              value={formData.arrivalDate}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Arrival Time:
            <input
              type="time"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Type of Transportation:
            <select
              name="typeOfTransportation"
              value={formData.typeOfTransportation}
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
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </label>

          <button type="submit">Update Transport</button>
          <button type="button" onClick={() => setEditTransport(null)}>
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <h2>Your Transports</h2>
          <ul>
            {transports.map((transport) => (
              <li key={transport._id}>
                <p>
                  {transport.departureDate} - {transport.departureTime} to{" "}
                  {transport.arrivalDate} - {transport.arrivalTime} ({transport.typeOfTransportation}) at {transport.location}
                  Number of bookings: {transport.numberOfTourists}
                </p>
                <button onClick={() => handleEdit(transport)}>Edit</button>
                <button onClick={() => handleDelete(transport._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ManageTransports;
