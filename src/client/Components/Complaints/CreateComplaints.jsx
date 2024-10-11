import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const CreateComplaints = () => {
  const location = useLocation();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitterId, setSubmitterId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (location.state && location.state.userId) {
      setSubmitterId(location.state.userId);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const complaint = {
      title,
      body,
      status: 'not started', // Hardcode status to 'not started'
      submitterId,
      date: new Date().toISOString() // Add current date
    };

    try {
      const response = await axios.post('/tourist/complaints', complaint);
      console.log('Complaint created:', response.data);
      setMessage('Complaint created successfully!');
      // Reset form fields
      setTitle('');
      setBody('');
    } catch (error) {
      console.error('Error creating complaint:', error);
      setMessage('Error creating complaint. Please try again.');
    }
  };

  return (
    <div>
      <h2>Create Complaint</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Body:</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Complaint</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateComplaints;