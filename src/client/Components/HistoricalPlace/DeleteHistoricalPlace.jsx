import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '/src/client/Assets/Img/logo.png';
import Footer from '/src/client/Components/Footer/Footer';
import styles from './DeleteHistoricalPlace.module.css'; // Import the CSS module

const DeleteHistoricalPlace = () => {
  const { id } = useParams(); // Get place ID from URL
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // For redirecting after delete

  useEffect(() => {
    const fetchPlaceById = async () => {
      try {
        const response = await axios.get(`/toursimgovernor/places/${id}`);
        setPlace(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching historical place:', err);
        setError('Failed to fetch historical place');
        setLoading(false);
      }
    };

    fetchPlaceById();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this place?')) {
      try {
        await axios.delete(`/toursimgovernor/places/${id}`);
        alert('Historical place deleted successfully');
        navigate('/'); // Redirect to home or list page after deletion
      } catch (err) {
        console.error('Error deleting historical place:', err);
        alert('Failed to delete historical place');
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src={Logo} alt="Safarny Logo" className={styles.logo} />
        <h1>Safarny</h1>
        <nav className={styles.nav}>
          <Link to="/" className={styles.button}>Back to Home</Link>
        </nav>
      </header>
      <h1>Delete Historical Place</h1>
      {place && (
        <div>
          <h2>{place.description}</h2>
          <p>Location: {place.location}</p>
          <p>Opening Hours: {place.openingHours}</p>
          <p>Ticket Prices: {place.ticketPrices}</p>
          <button onClick={handleDelete} className={styles.deleteButton}>Delete Place</button>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default DeleteHistoricalPlace;
