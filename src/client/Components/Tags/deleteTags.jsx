import React, { useState } from 'react';
import axios from 'axios';

const DeleteTags = () => {
  const [tagId, setTagId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.delete(`/tag/${tagId}`);
      setMessage('Tag deleted successfully!');
      setTagId('');
    } catch (error) {
      console.error('Error deleting tag:', error);
      setMessage('Failed to delete tag.');
    }
  };

  return (
    <div>
      <h1>Delete Tag</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={tagId}
          onChange={(e) => setTagId(e.target.value)}
          placeholder="Enter tag ID"
          required
        />
        <button type="submit">Delete Tag</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default DeleteTags;