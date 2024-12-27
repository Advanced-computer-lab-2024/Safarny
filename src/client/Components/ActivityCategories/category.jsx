import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ActivityCategory = () => {
  const [categories, setcategory] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchcategory = async () => {
      try {
        const response = await axios.get('/admin/category'); // Ensure this is the correct endpoint
        if (Array.isArray(response.data)) {
          setcategory(response.data);
        } else {
          setcategory([]);
          console.error('API response is not an array:', response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setMessage('Failed to fetch categories.');
      }
    };

    fetchcategory();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/admin/category/${id}`); // Ensure this is the correct endpoint
      setMessage('Category deleted successfully!');
      setcategory(categories.filter(ActivityCategory => ActivityCategory._id !== id)); // Use _id for MongoDB
    } catch (error) {
      console.error('Error deleting category:', error);
      setMessage('Failed to delete category.');
    }
  };

  return (
    <div>
      <h1>categories</h1>
      {message && <p>{message}</p>}
      <Link to="/createcategory">
        <button>Create New Category</button>
      </Link>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ActivityCategory.map(ActivityCategory => (
            <tr key={ActivityCategory._id}>
              <td>{ActivityCategory._id}</td>
              <td>{ActivityCategory.type}</td>
              <td>
                <Link to={`/editcategory/${ActivityCategory._id}`}>
                  <button>Edit</button>
                </Link>
                <button onClick={() => handleDelete(ActivityCategory._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityCategory;