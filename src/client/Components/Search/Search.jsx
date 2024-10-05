import React, { useState } from 'react';
import axios from 'axios';
import Footer from '/src/client/components/Footer/Footer';
import Logo from '/src/client/Assets/Img/logo.png';
import styles from './Search.module.css';
import { Link } from 'react-router-dom';

const Search = () => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState(''); // Define type as per your needs (e.g., 'historical', 'activity')
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  // Handle form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query) {
      setError('Please enter a search query.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3000/tourist/search', {
        params: { query, type },
      });

      console.log('API Response:', response.data);

      if (response.data.success) {
        setResults(response.data.results);
        setError('');
      } else {
        setResults([]);
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Error occurred while searching:', err);
      setResults([]);
      setError('An error occurred while searching.');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src={Logo} alt="Safarny Logo" className={styles.logo} />
        <h1>Safarny</h1>
        <nav className={styles.nav}>
          <Link to="/" className={styles.button}>Back to Home</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <h2>Search for Activities or Itineraries</h2>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <form onSubmit={handleSearch} className={styles.form}>
          <label>
            Search Query:
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
          </label>
          <label>
            Type:
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="">Select Type</option>
              <option value="historical">Historical Places</option>
              <option value="activity">Activities</option>
              <option value="itinerary">Itineraries</option>
            </select>
          </label>
          <button type="submit" className={styles.button}>
            Search
          </button>
        </form>

        {results.length > 0 && (
          <div className={styles.results}>
            <h3>Search Results:</h3>
            <ul>
              {results.map((item) => (
                <li key={item.id}>{item.name}</li> // Change 'item.name' to the appropriate property
              ))}
            </ul>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Search;
