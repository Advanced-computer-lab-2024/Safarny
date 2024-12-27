import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateCategory = () => {
  const [categoryType, setCategoryType] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/admin/category', { type: categoryType });
      setMessage('Category created successfully!');
      setCategoryType('');
      navigate('/admin'); // Navigate back to the Admin page
    } catch (error) {
      console.error('Error creating category:', error);
      setMessage('Failed to create category.');
    }
  };

  return (
    <div>
      <h1>Create category</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={categoryType}
          onChange={(e) => setCategoryType(e.target.value)}
          placeholder="Enter category type"
          required
        />
        <button type="submit">Create category</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateCategory;