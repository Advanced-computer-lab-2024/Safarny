import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Footer from '/src/client/Components/Footer/Footer';
import Header from '../Header/Header';
import styles from './CreateCommentForItinerary.module.css';

const CreateCommentForItinerary = () => {
  const { itineraryId } = useParams(); // Extracting itineraryId from URL
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newComment = { comment };

    try {
      const response = await axios.post(`/itineraries/${itineraryId}/comments`, newComment);
      console.log('Comment created:', response.data);
      setMessage('Comment created successfully!');
      setComment('');
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
            onChange={(e) => setComment(e.target.value)}
            required
            className={styles.textarea}
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
