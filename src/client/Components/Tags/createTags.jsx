import React, { useState } from 'react';
import axios from 'axios';

const CreateTags = () => {
  const [tagName, setTagName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/tag', { name: tagName });
      setMessage('Tag created successfully!');
      setTagName('');
    } catch (error) {
      console.error('Error creating tag:', error);
      setMessage('Failed to create tag.');
    }
  };

  return (
    <div>
      <h1>Create Tag</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          placeholder="Enter tag name"
          required
        />
        <button type="submit">Create Tag</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateTags;