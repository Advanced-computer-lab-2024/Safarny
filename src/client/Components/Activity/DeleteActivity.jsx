import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '/src/client/Components/Header/Header';
import Footer from '/src/client/Components/Footer/Footer';
import styles from "./DeleteActivity.module.css";
import { useParams } from 'react-router-dom';

const DeleteActivity = () => {
    const { userId } = useParams(); // Get userId from the URL
    const [activities, setActivities] = useState([]);
    const [selectedActivityId, setSelectedActivityId] = useState('');

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get(`/advertiser/activities/user/${userId}`); // Fetch activities for the specific user
                setActivities(response.data);
            } catch (error) {
                console.error('Error fetching activities:', error);
            }
        };

        fetchActivities();
    }, [userId]); // Dependency on userId

    const handleDelete = async () => {
        try {
            await axios.delete(`/advertiser/${selectedActivityId}`); // Delete the selected activity
            // Optionally refresh the activities list
            setActivities(activities.filter(activity => activity._id !== selectedActivityId));
            setSelectedActivityId(''); // Reset the selected activity
        } catch (error) {
            console.error('Error deleting activity:', error);
        }
    };

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.mainContent}>
                <h2 className={styles.heading}>Delete Activity</h2>
                <div className={styles.selectContainer}>
                    <select 
                        onChange={(e) => setSelectedActivityId(e.target.value)} 
                        value={selectedActivityId} 
                        className={styles.select}
                    >
                        <option value="">Select an Activity</option>
                        {Array.isArray(activities) && activities.length > 0 && activities.map(activity => (
                            <option key={activity._id} value={activity._id}>
                                {activity.location} - {activity.date}
                            </option>
                        ))}
                    </select>
                </div>
                <button 
                    onClick={handleDelete} 
                    disabled={!selectedActivityId} 
                    className={styles.button}
                >
                    Delete Activity
                </button>
            </div>
            <Footer />
        </div>
    );
};

export default DeleteActivity;
