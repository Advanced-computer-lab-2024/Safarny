import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './Preferences.module.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const Preferences = () => {
  const location = useLocation();
  const { userId } = location.state;
  const touristId = userId;

  const [preferences, setPreferences] = useState({
    historicAreas: [],
    beaches: [],
    familyFriendly: [],
    shopping: [],
    budget: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Predefined options
  const historicAreaOptions = ["Museums", "Ancient Ruins", "Castles", "Historic Monuments"];
  const beachOptions = ["Sandy Beach", "Rocky Beach", "Quiet Beach", "No Beach"];
  const shoppingOptions = ["Local Markets", "Luxury Stores", "Shopping Malls", "Souvenir Shops"];
  const familyFriendlyOptions = ["yes", "no"];
  const budgetOptions = ["low", "medium", "high"];

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        console.log('Fetching preferences for touristId:', touristId); // Log the touristId for debugging

        const response = await axios.get(`http://localhost:3000/preferences/${touristId}`);
        setPreferences(response.data.preferences);
      } catch (error) {
        setError('Error fetching preferences');
        console.error('Error fetching preferences:', error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [touristId]);

  const handleChange = (category, value) => {
    setPreferences({ ...preferences, [category]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`/preferences/${touristId}`, { preferences });
      alert('Preferences updated successfully!');
    } catch (error) {
      alert('Error updating preferences');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <h1 className={styles.title}>Preferences</h1>
        <p>These preferences will help you find the perfect travel experience.</p>
      <h2 className={styles.heading}>Edit Preferences</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
  
        {/* Historic Areas (multiple selection) */}
        <div className={styles.section}>
          <h3 className={styles.sectionHeading}>Historic Areas</h3>
          {historicAreaOptions.map((option) => (
            <label key={option} className={styles.label}>
              <input
                type="checkbox"
                checked={preferences.historicAreas.includes(option)}
                onChange={() => {
                  const selected = preferences.historicAreas.includes(option)
                    ? preferences.historicAreas.filter(item => item !== option)
                    : [...preferences.historicAreas, option];
                  handleChange('historicAreas', selected);
                }}
                className={styles.checkbox}
              />
              {option}
            </label>
          ))}
        </div>
  
        {/* Beaches (multiple selection) */}
        <div className={styles.section}>
          <h3 className={styles.sectionHeading}>Beaches</h3>
          {beachOptions.map((option) => (
            <label key={option} className={styles.label}>
              <input
                type="checkbox"
                checked={preferences.beaches.includes(option)}
                onChange={() => {
                  const selected = preferences.beaches.includes(option)
                    ? preferences.beaches.filter(item => item !== option)
                    : [...preferences.beaches, option];
                  handleChange('beaches', selected);
                }}
                className={styles.checkbox}
              />
              {option}
            </label>
          ))}
        </div>
  
        {/* Shopping (multiple selection) */}
        <div className={styles.section}>
          <h3 className={styles.sectionHeading}>Shopping</h3>
          {shoppingOptions.map((option) => (
            <label key={option} className={styles.label}>
              <input
                type="checkbox"
                checked={preferences.shopping.includes(option)}
                onChange={() => {
                  const selected = preferences.shopping.includes(option)
                    ? preferences.shopping.filter(item => item !== option)
                    : [...preferences.shopping, option];
                  handleChange('shopping', selected);
                }}
                className={styles.checkbox}
              />
              {option}
            </label>
          ))}
        </div>
  
        {/* Family Friendly (single selection) */}
        <div className={styles.section}>
          <h3 className={styles.sectionHeading}>Family Friendly</h3>
          <select
            value={preferences.familyFriendly[0] || ''}
            onChange={(e) => handleChange('familyFriendly', [e.target.value])}
            className={styles.select}
          >
            <option value="">Select</option>
            {familyFriendlyOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
  
        {/* Budget (single selection) */}
        <div className={styles.section}>
          <h3 className={styles.sectionHeading}>Budget</h3>
          <select
            value={preferences.budget[0] || ''}
            onChange={(e) => handleChange('budget', [e.target.value])}
            className={styles.select}
          >
            <option value="">Select</option>
            {budgetOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
  
        <button type="submit" className={styles.button}>Save Preferences</button>
      </form>
      </div>
      <Footer />
    </div>
  );
  
};

export default Preferences;
