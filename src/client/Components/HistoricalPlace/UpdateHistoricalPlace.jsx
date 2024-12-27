import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Logo from '/src/client/Assets/Img/logo.png';
import Footer from '/src/client/components/Footer/Footer';
import styles from './UpdateHistoricalPlace.module.css'; // Import the CSS module

const UpdateHistoricalPlace = () => {
  const { id } = useParams(); // Get place ID from URL
  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    pictures: '',
    location: '',
    openingHours: '',
    ticketPrices: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false); // State to track the update operation

  useEffect(() => {
    const fetchPlaceById = async () => {
      try {
        console.log(`Fetching place with ID: ${id}`); // Log the ID
        const response = await axios.get(`/toursimgovernor/places/${id}`);
        setPlace(response.data);
        setFormData(response.data); // Initialize the form with fetched data
        setLoading(false);
      } catch (err) {
        console.error('Error fetching historical place:', err);
        setError('Failed to fetch historical place');
        setLoading(false);
      }
    };

    fetchPlaceById();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true); // Set updating to true when starting the update
    try {
      console.log(`Updating place with ID: ${id}`); // Log the ID
      await axios.put(`/toursimgovernor/places/${id}`, formData);
      alert('Historical place updated successfully');
    } catch (err) {
      console.error('Error updating historical place:', err);
      setError('Failed to update historical place'); // Set error message
    } finally {
      setUpdating(false); // Reset updating state
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
      <h1>Update Historical Place</h1>
      <form onSubmit={handleSubmit} className={styles.updateForm}>
        <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Pictures (comma separated URLs):</label>
          <input
            type="text"
            name="pictures"
            value={formData.pictures}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Opening Hours:</label>
          <input
            type="text"
            name="openingHours"
            value={formData.openingHours}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Ticket Prices:</label>
          <input
            type="text"
            name="ticketPrices"
            value={formData.ticketPrices}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton} disabled={updating}>
          {updating ? 'Updating...' : 'Update Place'}
        </button>
        {error && <p className={styles.error}>{error}</p>} {/* Display error message */}
      </form>
      <Footer />
    </div>
  );
};

export default UpdateHistoricalPlace;