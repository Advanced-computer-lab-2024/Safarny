import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Footer from '/src/client/Components/Footer/Footer';
import Header from '../Header/Header';
import styles from './CreateComplaints.module.css';
import { FaExclamationCircle, FaPaperPlane, FaCheck } from 'react-icons/fa';

const CreateComplaints = () => {
  const location = useLocation();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitterId, setSubmitterId] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (location.state && location.state.userId) {
      setSubmitterId(location.state.userId);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
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
      setSubmitSuccess(true);
      setMessage('Complaint submitted successfully!');
      setTitle('');
      setBody('');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error creating complaint:', error);
      setMessage('Error submitting complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      <main className={styles.mainContent}>
        {/* <div className={`${styles.titleSection} bg-dark`}> */}
          <div className="container text-center py-5">
            <h1 className="display-4 mb-3 text-black">Submit a Complaint</h1>
            {/* <p className="lead text-white-50 mb-0">We're here to help resolve your concerns</p> */}
          </div>
        {/* </div> */}

        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className={`${styles.complaintCard} card shadow-sm`}>
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-4">
                    <FaExclamationCircle className="text-primary me-2" size={24} />
                    <h3 className="mb-0">Complaint Details</h3>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="title" className="form-label">
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        className={`form-control ${styles.input}`}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Brief description of your complaint"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="body" className="form-label">
                        Description
                      </label>
                      <textarea
                        id="body"
                        className={`form-control ${styles.textarea}`}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                        rows="6"
                        placeholder="Please provide detailed information about your complaint"
                      />
                    </div>

                    <div className="d-grid">
                      <button
                        type="submit"
                        className={`btn btn-primary ${styles.submitButton}`}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane className="me-2" />
                            Submit Complaint
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {message && (
                    <div className={`alert ${submitSuccess ? 'alert-success' : 'alert-danger'} mt-4 d-flex align-items-center`}>
                      {submitSuccess ? (
                        <FaCheck className="me-2" />
                      ) : (
                        <FaExclamationCircle className="me-2" />
                      )}
                      {message}
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

export default CreateComplaints;
