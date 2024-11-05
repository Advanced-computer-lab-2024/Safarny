import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Footer from '/src/client/Components/Footer/Footer';
import Header from '../Header/Header';
import styles from './CreateComplaints.module.css';

const CreateComplaints = () => {
  const location = useLocation();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitterId, setSubmitterId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (location.state && location.state.userId) {
      setSubmitterId(location.state.userId);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const complaint = {
      title,
      body,
      status: 'pending',
      submitterId,
      date: new Date().toISOString(),
    };

    try {
      const response = await axios.post('/tourist/complaints', complaint);
      console.log('Complaint created:', response.data);
      setMessage('Complaint created successfully!');
      setTitle('');
      setBody('');
    } catch (error) {
      console.error('Error creating complaint:', error);
      setMessage('Error creating complaint. Please try again.');
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2 className={styles.heading}>Create Complaint</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Body:</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              className={styles.textarea}
            />
          </div>
          <button type="submit" className={styles.button}>
            Submit Complaint
          </button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
      </div>
      <Footer />
    </>
  );
};

export default CreateComplaints;
