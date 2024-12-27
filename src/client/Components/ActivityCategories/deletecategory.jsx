import React, { useState } from 'react';
import axios from 'axios';

const Deletecategory = () => {
  const [categoryId, setcategoryId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.delete(`/admin/category/${categoryId}`);
      setMessage('Category deleted successfully!');
      setcategoryId('');
    } catch (error) {
      console.error('Error deleting category:', error);
      setMessage('Failed to delete category.');
    }
  };

  return (
    <div>
      <h1>Delete category</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={categoryId}
          onChange={(e) => setcategoryId(e.target.value)}
          placeholder="Enter category ID"
          required
        />
        <button type="submit">Delete category</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Deletecategory;