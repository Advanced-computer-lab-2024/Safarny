import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './Preferences.module.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { FaTags, FaSave, FaCheck } from 'react-icons/fa';

const Preferences = () => {
  const location = useLocation();
  const { userId } = location.state;
  const touristId = userId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [historicalTags, setHistoricalTags] = useState([]);
  const [selectedHistoricalTags, setSelectedHistoricalTags] = useState([]);

  useEffect(() => {
    const fetchData = async() => {
      try {
        setLoading(true);
        const tagsResponse = await axios.get('http://localhost:3000/admin/tag');
        setTags(tagsResponse.data);
        
        const historicalTagsResponse = await axios.get('http://localhost:3000/toursimgovernor/gettags');
        setHistoricalTags(historicalTagsResponse.data);
        
        const userResponse = await axios.get(`http://localhost:3000/tourist/${touristId}`);
        if (userResponse.data.preferencestags) {
          setSelectedTags(userResponse.data.preferencestags);
        }
        if (userResponse.data.preferedhistoricaltags) {
          setSelectedHistoricalTags(userResponse.data.preferedhistoricaltags);
        }
      } catch (error) {
        setError('Error fetching data');
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [touristId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log('Submitting preferences:', {
        preferencestags: selectedTags,
        preferedhistoricaltags: selectedHistoricalTags
      });

      const response = await axios.put(`http://localhost:3000/tourist/${touristId}`, {
        preferencestags: selectedTags,
        preferedhistoricaltags: selectedHistoricalTags
      });
      
      if (response.data) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        console.log('Preferences saved successfully:', response.data);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Error updating preferences');
    }
  };

  const handleTagSelection = (tagId) => {
    setSelectedTags(prev => {
      return prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId];
    });
  };

  const handleHistoricalTagSelection = (tagId) => {
    setSelectedHistoricalTags(prev => {
      const newSelection = prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId];
      console.log('Updated historical tags selection:', newSelection);
      return newSelection;
    });
  };

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <Header />
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageWrapper}>
        <Header />
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      <main className={styles.mainContent}>
        {/* <div className={`${styles.titleSection} d-flex flex-column justify-content-center align-items-center`}> */}
          <div className="container text-center py-5">
            <h1 className="display-4 mb-3 text-black">My Preferences</h1>
            {/* <p className="lead text-white-50 mb-0">Personalize your experience by selecting your interests</p> */}
          </div>
        {/* </div> */}

        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className={`${styles.preferencesCard} card shadow-sm`}>
                <div className="card-body p-4">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <div className="d-flex align-items-center mb-3">
                        <FaTags className="text-primary me-2" size={24} />
                        <h3 className="mb-0">Available Tags</h3>
                      </div>
                      
                      <div className={styles.tagsGrid}>
                        {tags.map((tag) => (
                          <div key={tag._id} className={styles.tagItem}>
                            <input
                              type="checkbox"
                              id={tag._id}
                              className="btn-check"
                              checked={selectedTags.includes(tag._id)}
                              onChange={() => handleTagSelection(tag._id)}
                              autoComplete="off"
                            />
                            <label
                              className={`btn ${selectedTags.includes(tag._id) ? 'btn-primary' : 'btn-outline-primary'} w-100`}
                              htmlFor={tag._id}
                            >
                              {selectedTags.includes(tag._id) && <FaCheck className="me-2" />}
                              {tag.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`${styles.selectedSection} bg-light p-3 rounded mb-4`}>
                      <h4 className="mb-3 text-black">Selected Preferences</h4>
                      <div className={styles.selectedTags}>
                        {selectedTags.length > 0 ? (
                          selectedTags.map(tagId => {
                            const tag = tags.find(t => t._id === tagId);
                            return tag ? (
                              <span key={tagId} className="badge bg-primary me-2 mb-2 p-2">
                                {tag.name}
                              </span>
                            ) : null;
                          })
                        ) : (
                          <p className="mb-0 text-white">No tags selected</p>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="d-flex align-items-center mb-3">
                        <FaTags className="text-primary me-2" size={24} />
                        <h3 className="mb-0">Historical Place Tags</h3>
                      </div>
                      
                      <div className={styles.tagsGrid}>
                        {historicalTags.map((tag) => (
                          <div key={tag._id} className={styles.tagItem}>
                            <input
                              type="checkbox"
                              id={`historical-${tag._id}`}
                              className="btn-check"
                              checked={selectedHistoricalTags.includes(tag._id)}
                              onChange={() => handleHistoricalTagSelection(tag._id)}
                              autoComplete="off"
                            />
                            <label
                              className={`btn ${selectedHistoricalTags.includes(tag._id) ? 'btn-primary' : 'btn-outline-primary'} w-100`}
                              htmlFor={`historical-${tag._id}`}
                            >
                              {selectedHistoricalTags.includes(tag._id) && <FaCheck className="me-2" />}
                              {tag.name}
                            </label>
                          </div>
                        ))}
                      </div>
                      
                      <div className={`${styles.selectedSection} bg-light p-3 rounded mb-4`}>
                        <h4 className="mb-3 text-black">Selected Historical Tags</h4>
                        <div className={styles.selectedTags}>
                          {selectedHistoricalTags.length > 0 ? (
                            selectedHistoricalTags.map(tagId => {
                              const tag = historicalTags.find(t => t._id === tagId);
                              return tag ? (
                                <span key={tagId} className="badge bg-primary me-2 mb-2 p-2">
                                  {tag.name}
                                </span>
                              ) : null;
                            })
                          ) : (
                            <p className="mb-0 text-white">No historical tags selected</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="d-grid">
                      <button
                        type="submit"
                        className={`btn btn-primary ${styles.submitButton}`}
                        disabled={loading}
                      >
                        <FaSave className="me-2" />
                        Save Preferences
                      </button>
                    </div>
                  </form>

                  {saveSuccess && (
                    <div className="alert alert-success mt-3 mb-0" role="alert">
                      <FaCheck className="me-2" />
                      Preferences saved successfully!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Preferences;
