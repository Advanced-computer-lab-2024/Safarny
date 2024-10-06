import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Logo from '/src/client/Assets/Img/logo.png';
import Footer from '/src/client/components/Footer/Footer';
import styles from './ReadHistoricalPlace.module.css'; // Import the CSS module

const ReadHistoricalPlace = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openingHoursFilter, setOpeningHoursFilter] = useState('');

  useEffect(() => {
    const fetchHistoricalPlaces = async () => {
      try {
        const response = await axios.get('http://localhost:3000/toursimgovernor/places');
        const placesData = response.data;
        console.log(placesData);

        if (Array.isArray(placesData)) {
          setPlaces(placesData);
        } else {
          console.error("Expected an array, but got:", typeof placesData);
          setError('Invalid data format received');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching historical places:', err);
        setError('Failed to fetch historical places');
        setLoading(false);
      }
    };

    fetchHistoricalPlaces();
  }, []);

  // Handle filtering historical places based on search term and opening hours
  const filteredPlaces = places.filter(place =>
    place.description && place.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (openingHoursFilter ? place.openingHours.toLowerCase().includes(openingHoursFilter.toLowerCase()) : true)
  );

  if (loading) {
    return <p>Loading historical places...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src={Logo} alt="Safarny Logo" className={styles.logo} />
        <h1>Safarny</h1>
        <nav className={styles.nav}>
          <Link to="/" className={styles.button}>Back to Home</Link>
        </nav>
      </header>
      <h1>Historical Places</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by description..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />

      {/* Opening Hours Filter */}
      <div className={styles.openingHoursFilter}>
        <label>Filter by opening hours:</label>
        <input
          type="text"
          placeholder="e.g., monday:00 AM - 5:00 PM"
          value={openingHoursFilter}
          onChange={(e) => setOpeningHoursFilter(e.target.value)}
          className={styles.openingHoursInput}
        />
      </div>

      {filteredPlaces.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {filteredPlaces.map(place => (
            <div className={styles.placeCard} key={place._id}>
              <h2 className={styles.placeName}>{place.description}</h2>
              <p>Opening Hours: {place.openingHours}</p>
              <p>Description: {place.description}</p>
              {place.pictures && place.pictures.length > 0 && (
                <img className={styles.placeImage} src={place.pictures[0]} alt={place.description} />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No historical places available</p>
      )}
      <Footer />
    </div>
  );
};

export default ReadHistoricalPlace;