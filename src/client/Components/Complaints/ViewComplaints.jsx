import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import styles from './ViewComplaints.module.css';
import Footer from '/src/client/Components/Footer/Footer';
import Header from '../Header/Header';
import { FaExclamationCircle, FaComments, FaClock, FaCheckCircle, FaSpinner, FaBan } from 'react-icons/fa';

const statusIcons = {
  pending: <FaSpinner className="text-warning" />,
  resolved: <FaCheckCircle className="text-success" />,
  cancelled: <FaBan className="text-danger" />
};

const ViewComplaints = () => {
  const location = useLocation();
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const userId = location.state.userId;
        const complaintsResponse = await axios.get(`/tourist/complaints/${userId}`);
        setComplaints(complaintsResponse.data);
      } catch (err) {
        console.error('Error:', err);
        if (err.response && err.response.status === 404) {
          setError('No complaints found for this submitter.');
        } else {
          setError('Error fetching complaints. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [location.state]);

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <Header />
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading your complaints...</p>
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
        {/* <div className={`${styles.titleSection} bg-dark`}> */}
          <div className="container text-center py-5">
            <h1 className="display-4 mb-3 text-black">My Complaints</h1>
            {/* <p className="lead text-white-50 mb-0">Track and manage your submitted complaints</p> */}
          </div>
        {/* </div> */}

        <div className="container py-5">
          {error ? (
            <div className="alert alert-danger" role="alert">
              <FaExclamationCircle className="me-2" />
              {error}
            </div>
          ) : (
            <div className="row">
              {complaints.length === 0 ? (
                <div className="col-12">
                  <div className={`${styles.complaintCard} card text-center p-5`}>
                    <FaExclamationCircle className="display-1 text-muted mb-3 mx-auto" />
                    <h3>No Complaints Found</h3>
                    <p className="text-muted">You haven't submitted any complaints yet.</p>
                  </div>
                </div>
              ) : (
                complaints.map((complaint) => (
                  <div key={complaint._id} className="col-12 mb-4">
                    <div className={`${styles.complaintCard} card`}>
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <h3 className={styles.title}>{complaint.title}</h3>
                          <span className={`badge ${styles[complaint.status]}`}>
                            {statusIcons[complaint.status]}
                            <span className="ms-2">
                              {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                            </span>
                          </span>
                        </div>

                        <div className="mb-4">
                          <p className={styles.body}>{complaint.body}</p>
                        </div>

                        <div className="d-flex align-items-center text-white mb-4">
                          <FaClock className="me-2" />
                          <span>Submitted on {new Date(complaint.date).toLocaleDateString("en-US", {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</span>
                        </div>

                        {complaint.comments && complaint.comments.length > 0 && (
                          <div className={styles.commentsSection}>
                            <div className="d-flex align-items-center mb-3">
                              <FaComments className="me-2" />
                              <h4 className="mb-0">Comments</h4>
                            </div>
                            <div className={styles.commentsList}>
                              {complaint.comments.map((comment, index) => (
                                <div key={index} className={styles.commentItem}>
                                  <p className="mb-0">{comment}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ViewComplaints;