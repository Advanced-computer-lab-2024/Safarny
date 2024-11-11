import React, { useState } from 'react';
import axios from 'axios';
import Footer from '/src/client/Components/Footer/Footer';
import Header from '../Header/Header';
import styles from './CreateCommentForTourGuide.module.css';
import { useParams } from 'react-router-dom';

const CreateCommentForTourGuide = () => {
  const { tourGuideId } = useParams();  // Get tourGuideId from URL
  const [comment, setComment] = useState('');  // State for storing the comment
  const [message, setMessage] = useState('');  // State for displaying success/error message

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newComment = {
      comment,
      tourGuideId: tourGuideId,  // Pass tourGuideId if available, otherwise omit it
    };

    try {
      const response = await axios.post('/tourist/comments/tourguide', newComment);  // API URL adjusted to handle comments generically
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
        <button type="submit" className={styles.button}>Submit Comment</button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
      <Footer />
    </div>
  );
};

export default CreateCommentForTourGuide;