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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const fetchData = async() => {
      try {
        setLoading(true);
        // Fetch tags
        const tagsResponse = await axios.get('http://localhost:3000/admin/tag');
        console.log('Available tags:', tagsResponse.data); // Debug log
        setTags(tagsResponse.data);
        
        // Fetch user to get selected tags
        const userResponse = await axios.get(`http://localhost:3000/tourist/${touristId}`);
        console.log('User data:', userResponse.data); // Debug log
        
        if (userResponse.data.preferencestags) {
          setSelectedTags(userResponse.data.preferencestags);
        }
      } catch (error) {
        console.error('Fetch error:', error); // Debug log
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [touristId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log('Sending selected tags:', selectedTags); // Debug log
      
      // Update user's preferred tags
      const response = await axios.put(`http://localhost:3000/tourist/${touristId}`, { 
        preferencestags: selectedTags 
      });
      
      console.log('Update response:', response.data); // Debug log
      
      if (response.data) {
        alert('Tags updated successfully!');
      }
    } catch (error) {
      console.error('Update error:', error.response?.data || error); // Debug log
      alert('Error updating tags');
    }
  };

  const handleTagSelection = (tagId) => {
    console.log('Toggling tag:', tagId); // Debug log
    setSelectedTags(prev => {
      const newSelected = prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId];
      console.log('New selected tags:', newSelected); // Debug log
      return newSelected;
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <h2>Preferences</h2>
        <p>Select your preferred tags to help us personalize your experience.</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h3 className={styles.sectionHeading}>Preferred Tags</h3>
            <div className={styles.tagsContainer}>
              {tags.map((tag) => (
                <label key={tag._id} className={styles.label}>
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag._id)}
                    onChange={() => handleTagSelection(tag._id)}
                    className={styles.checkbox}
                  />
                  {tag.name}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className={styles.button}>Save Tags</button>
        </form>

        <div className={styles.selectedTags}>
          <h3 style={{ color: 'white' }}>Currently Selected Tags:</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {selectedTags.map(tagId => {
              const tag = tags.find(t => t._id === tagId);
              return tag ? <span key={tagId} className={styles.tag} style={{ color: 'white' }}>{tag.name}</span> : null;
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Preferences;
