import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import styles from './ViewComplaints.module.css';
import Footer from '/src/client/Components/Footer/Footer';
import Header from '../Header/Header';

const ViewComplaints = () => {
    const location = useLocation();
    const [complaints, setComplaints] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const userId = location.state.userId;
                console.log('User ID:', userId);

                const complaintsResponse = await axios.get(`/tourist/complaints/${userId}`);
                console.log('Complaints Response:', complaintsResponse.data);

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
            <div className={styles.fullScreen}>
                <Header />
                <p className={styles.loading}>Loading...</p>
                <Footer />
            </div>
        );
    }

    return (
            
            <div className={styles.container}>
                <Header />
                <h2 className={styles.heading}>My Complaints</h2>
                {error ? (
                    <p className={styles.error}>{error}</p>
                ) : (
                    <ul className={styles.list}>
                        {complaints.length === 0 ? (
                            <p className={styles.noComplaints}>No complaints found. You have not made any complaints yet.</p>
                        ) : (
                            complaints.map((complaint) => (
                                <li key={complaint._id} className={styles.item}>
                                    <h3 className={styles.title}>{complaint.title}</h3>
                                    <p className={styles.body}>{complaint.body}</p>
                                    <p className={styles.status}>Status: {complaint.status}</p>
                                    <p className={styles.date}>Date: {new Date(complaint.date).toLocaleString()}</p>
                                </li>
                            ))
                        )}
                    </ul>
                )}
                <Footer />
            </div>
            
    );
};

export default ViewComplaints;
