import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditTransport = ({ transportId, advertiserId }) => {
  const [transportData, setTransportData] = useState(null);

  useEffect(() => {
    // Fetch the transport data for the given transportId
    const fetchTransport = async () => {
      try {
        const response = await axios.get(`/transport/transports/${transportId}`);
        setTransportData(response.data);
      } catch (error) {
        console.error('Error fetching transport:', error);
      }
    };
    fetchTransport();
  }, [transportId]);

  const handleInputChange = (e) => {
    setTransportData({ ...transportData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/transport/transports/${transportId}`, transportData);
      alert('Transport updated successfully');
    } catch (error) {
      console.error('Error updating transport:', error);
      alert('Failed to update transport');
    }
  };

  if (!transportData) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit}>
      {/* Input fields for transportData properties */}
      <button type="submit">Update Transport</button>
    </form>
  );
};

export default EditTransport;
