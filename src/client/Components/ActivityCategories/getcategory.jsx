import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ActivityCategory from "../Admin/ActivityCategory";

const Getcategory = () => {
  const [category, setcategory] = useState([]);

  useEffect(() => {
    const fetchcategory = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/category');
        setcategory(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchcategory();
  }, []);

  return (
    <div>
      <h1>Category</h1>
      <ul>
        {Array.isArray(ActivityCategory) && ActivityCategory.map(ActivityCategory => (
          <li key={ActivityCategory._id}>{ActivityCategory.type}</li>
        ))}
      </ul>
    </div>
  );
};

export default Getcategory;