// In DeleteActivity.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DeleteActivity = () => {
    const [activities, setActivities] = useState([]);
    const [selectedActivityId, setSelectedActivityId] = useState('');

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get('/advertiser/'); // Replace with your actual endpoint
                setActivities(response.data);
            } catch (error) {
                console.error('Error fetching activities:', error);
            }
        };

        fetchActivities();
    }, []);

    const handleDelete = async () => {
        try {
            await axios.delete(`/advertiser/${selectedActivityId}`);
            // Optionally refresh the activities list
            setActivities(activities.filter(activity => activity._id !== selectedActivityId));
        } catch (error) {
            console.error('Error deleting activity:', error);
        }
    };

    return (
        <div>
            <h2>Delete Activity</h2>
            <select onChange={(e) => setSelectedActivityId(e.target.value)} value={selectedActivityId}>
                <option value="">Select an Activity</option>
                {Array.isArray(activities) && activities.length > 0 &&activities.map(activity => (
                    <option key={activity._id} value={activity._id}>
                        {activity.location} - {activity.date}
                    </option>
                ))}
            </select>
            <button onClick={handleDelete} disabled={!selectedActivityId}>Delete Activity</button>
        </div>
    );
};

export default DeleteActivity;
