import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../Itinerary/itinerary.module.css';

const Plans = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get('/iternary/get');
        console.log(response.data);  // Check the structure of the response
        // Assuming the response.data is an array, otherwise adjust the structure
        setItineraries(Array.isArray(response.data) ? response.data : []); // Ensure it's an array
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Error fetching itineraries');
        setLoading(false);
      }
    };

    fetchItineraries();
  }, []);

  if (loading) {
    return <p>Loading itineraries...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles.container}>
      <h2>All Itineraries</h2>
      <ul className={styles.itineraryList}>
        {itineraries.map((itinerary) => (
         <li key={itinerary._id} className={styles.itineraryItem}>
            <h3>{itinerary.name}</h3>
            <p>{itinerary.category}</p>
            <p>{itinerary.duration}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Plans;
