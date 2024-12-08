import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '/src/client/Components/Header/Header';
import Footer from '/src/client/Components/Footer/Footer';
import styles from "./DeleteActivity.module.css";
import { useParams, Link } from 'react-router-dom';
import { FaTrash, FaExclamationTriangle, FaPlus } from 'react-icons/fa';

const DeleteActivity = () => {
    const { userId } = useParams();
    const [activities, setActivities] = useState([]);
    const [selectedActivityId, setSelectedActivityId] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`http://localhost:3000/advertiser/activities/user/${userId}`);
                
                if (response.data && Array.isArray(response.data)) {
                    setActivities(response.data);
                } else {
                    setActivities([]);
                }
            } catch (error) {
                console.error('Error fetching activities:', error);
                if (error.response?.status === 404) {
                    setActivities([]);
                } else {
                    setMessage('Unable to connect to the server. Please try again later.');
                    setMessageType('error');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchActivities();
    }, [userId]);

    const handleDelete = async () => {
        if (!selectedActivityId) {
            setMessage('Please select an activity to delete.');
            setMessageType('error');
            return;
        }

        try {
            await axios.delete(`http://localhost:3000/advertiser/${selectedActivityId}`);
            setActivities(activities.filter(activity => activity._id !== selectedActivityId));
            setSelectedActivityId('');
            setMessage('Activity deleted successfully!');
            setMessageType('success');
        } catch (error) {
            console.error('Error deleting activity:', error);
            setMessage('Error deleting activity. Please try again.');
            setMessageType('error');
        }
    };

    if (isLoading) {
        return (
            <div className={styles.pageWrapper}>
                <Header />
                <main className={styles.mainContent}>
                    <div className="container py-4">
                        <div className={styles.deleteCard}>
                            <div className={styles.loadingState}>
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p>Loading activities...</p>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!isLoading && activities.length === 0) {
        return (
            <div className={styles.pageWrapper}>
                <Header />
                <main className={styles.mainContent}>
                    <div className="container py-4">
                        <div className={styles.deleteCard}>
                            <div className={styles.emptyState}>
                                <FaPlus className={styles.emptyStateIcon} />
                                <h3>No Activities Found</h3>
                                <p>You haven't created any activities yet.</p>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className={styles.pageWrapper}>
            <Header />
            <main className={styles.mainContent}>
                <div className="container py-4">
                    <div className={styles.deleteCard}>
                        <div className={styles.cardHeader}>
                            <FaTrash className={styles.headerIcon} />
                            <h2>Delete Activity</h2>
                            <p className={styles.headerDescription}>
                                Select an activity to remove from your listings
                            </p>
                        </div>

                        <div className={styles.cardBody}>
                            <div className={styles.selectContainer}>
                                <select 
                                    className="form-select form-select-lg"
                                    onChange={(e) => setSelectedActivityId(e.target.value)} 
                                    value={selectedActivityId}
                                >
                                    <option value="">Select an Activity</option>
                                    {activities.map(activity => (
                                        <option key={activity._id} value={activity._id}>
                                            {activity.location} - {activity.date}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedActivityId && (
                                <div className={styles.warningBox}>
                                    <FaExclamationTriangle className={styles.warningIcon} />
                                    <p>Are you sure you want to delete this activity? This action cannot be undone.</p>
                                </div>
                            )}

                            <button 
                                onClick={handleDelete} 
                                disabled={!selectedActivityId}
                                className={`${styles.deleteButton} ${!selectedActivityId ? styles.disabled : ''}`}
                            >
                                Delete Activity
                            </button>

                            {message && (
                                <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'} mt-3`}>
                                    {message}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default DeleteActivity;
