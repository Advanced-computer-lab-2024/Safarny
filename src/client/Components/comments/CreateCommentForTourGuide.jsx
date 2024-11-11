import React, { useState } from 'react';
import axios from 'axios';
import Footer from '/src/client/Components/Footer/Footer';
import Header from '../Header/Header';
import styles from './CreateCommentForTourGuide.module.css';

const CreateCommentForTourGuide = () => {
  const [comment, setComment] = useState('');  // State for storing the comment
  const [message, setMessage] = useState('');  // State for displaying success/error message
  const [tourGuideId, setTourGuideId] = useState('');  // Optional: Tour Guide ID (can be empty)
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newComment = { 
      comment, 
      tourGuideId: tourGuideId || undefined,  // Pass tourGuideId if available, otherwise omit it
    };

    try {
      const response = await axios.post('/comments', newComment);  // API URL adjusted to handle comments generically
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
      <h2 className={styles.heading}>Create Comment for Tour Guide</h2>
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
          <label className={styles.label}>Tour Guide ID (optional):</label>
          <input
            type="text"
            value={tourGuideId}
            onChange={(e) => setTourGuideId(e.target.value)}  // Handle tour guide ID input
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

export default CreateCommentForTourGuide;
