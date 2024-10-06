import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateHistoricalTags = () => {
  const [tagName, setTagName] = useState(''); // For the tag name
  const [message, setMessage] = useState(''); // For success/error messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/historical-tags', { name: tagName }); // Update the endpoint accordingly
      setMessage('Historical tag created successfully!'); // Success message
      setTagName(''); // Clear input field
      navigate('/admin'); // Navigate back to the Admin page or another relevant page
    } catch (error) {
      console.error('Error creating historical tag:', error);
      setMessage('Failed to create historical tag.'); // Error message
    }
  };

  return (
    <div>
      <h1>Create Historical Tag</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          placeholder="Enter historical tag name"
          required
        />
        <button type="submit">Create Historical Tag</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateHistoricalTags;
