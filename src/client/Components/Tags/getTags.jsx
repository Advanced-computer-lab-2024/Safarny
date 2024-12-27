import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GetTags = () => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('/tag');
        setTags(response.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  return (
    <div>
      <h1>Tags</h1>
      <ul>
        {Array.isArray(tags) && tags.map(tag => (
          <li key={tag._id}>{tag.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default GetTags;