import React, { useState } from 'react';
import axios from 'axios';
import Footer from '/src/client/Components/Footer/Footer';
import Header from '../Header/Header';
import styles from './CreateCommentForItinerary.module.css';

const CreateCommentForItinerary = () => {
  const [comment, setComment] = useState('');  // State for storing the comment
  const [message, setMessage] = useState('');  // State for displaying success/error message
  const [itineraryId, setItineraryId] = useState('');  // Optional: Itinerary ID (can be empty)
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newComment = { 
      comment, 
      itineraryId: itineraryId || undefined,  // Pass itineraryId if available, otherwise omit it
    };

    try {
      const response = await axios.post('/tourist/comments/itinerary', newComment);  // API URL adjusted
      console.log('Comment created:', response.data);
      setMessage('Comment created successfully!');
      setComment('');  // Clear the comment input field
    } catch (error) {
      console.error('Error creating comment:', error);
      setMessage('Error creating comment. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <h2 className={styles.heading}>Create Comment for Itinerary</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}  // Handling comment change
            required
            className={styles.textarea}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Itinerary ID (optional):</label>
          <input
            type="text"
            value={itineraryId}
            onChange={(e) => setItineraryId(e.target.value)}  // Handle itinerary ID input
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>Submit Comment</button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
      <Footer />
    </div>
  );
};

export default CreateCommentForItinerary;
