import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditTags = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tagName, setTagName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTag = async () => {
      try {
        const response = await axios.get(`/admin/tag/${id}`);
        setTagName(response.data.name);
      } catch (error) {
        console.error('Error fetching tag:', error);
        setMessage('Failed to fetch tag.');
      }
    };

    fetchTag();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/admin/tag/${id}`, { name: tagName });
      setMessage('Tag updated successfully!');
      navigate('/admin'); // Navigate back to the Admin page
    } catch (error) {
      console.error('Error updating tag:', error);
      setMessage('Failed to update tag.');
    }
  };

  return (
    <div>
      <h1>Edit Tag</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          placeholder="Enter tag name"
          required
        />
        <button type="submit">Update Tag</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default EditTags;