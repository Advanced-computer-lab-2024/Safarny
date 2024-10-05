import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Editcategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categoryName, setcategoryName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchcategory = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/admin/category/${id}`);
        setcategoryName(response.data.type);
      } catch (error) {
        console.error('Error fetching category:', error);
        setMessage('Failed to fetch category.');
      }
    };

    fetchcategory();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/admin/category/${id}`, { type: categoryName });
      setMessage('Category updated successfully!');
      navigate('/admin'); // Navigate back to the Admin page
    } catch (error) {
      console.error('Error updating category:', error);
      setMessage('Failed to update category.');
    }
  };

  return (
    <div>
      <h1>Edit category</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setcategoryName(e.target.value)}
          placeholder="Enter category name"
          required
        />
        <button type="submit">Update category</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Editcategory;