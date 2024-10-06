import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '/src/client/Assets/Img/logo.png';
import Footer from '/src/client/components/Footer/Footer';

// Import getAllHistoricalPlaces from the correct path
import { getAllHistoricalPlaces } from '/src/server/controllers/historicalplacesController';

const ReadHistoricalPlace = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortByRating, setSortByRating] = useState(false);

  useEffect(() => {
    const fetchHistoricalPlaces = async () => {
      try {
        const placesData = await getAllHistoricalPlaces(); // Use the imported function
        
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

  // Handle filtering historical places based on search term and date
  const filteredPlaces = places.filter(place => 
    place.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (dateFilter ? new Date(place.date) <= new Date(dateFilter) : true)
  );

  // Handle sorting historical places by ratings if needed
  const sortedPlaces = sortByRating
    ? [...filteredPlaces].sort((a, b) => b.rating - a.rating) // Assuming 'rating' is a field in your historical place data
    : filteredPlaces;

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
        placeholder="Search by name..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        className={styles.searchInput}
      />

      {/* Date Filter */}
      <div className={styles.dateFilter}>
        <label>Filter by date (before):</label>
        <input 
          type="date" 
          value={dateFilter} 
          onChange={(e) => setDateFilter(e.target.value)} 
          className={styles.dateInput}
        />
      </div>

      {/* Sort by Ratings */}
      <div className={styles.sortOptions}>
        <label>
          <input 
            type="checkbox" 
            checked={sortByRating} 
            onChange={() => setSortByRating(!sortByRating)} 
          />
          Sort by Ratings
        </label>
      </div>

      {sortedPlaces.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {sortedPlaces.map(place => (
            <div className={styles.placeCard} key={place._id}>
              <h2 className={styles.placeName}>{place.name}</h2>
              <p>Date: {new Date(place.date).toLocaleDateString()}</p>
              <p>Rating: {place.rating}</p>
              <p>Description: {place.description}</p>
              <img className={styles.placeImage} src={place.imageurl} alt={place.name} />
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
