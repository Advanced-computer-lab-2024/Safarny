import React, { useState, useEffect } from 'react';

const ReadActivities = () => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchActivities = async () => {
            const response = await fetch('/advertiser/');
            const data = await response.json();
            setActivities(data);
        };

        fetchActivities();
    }, []);

    return (
        <div>
            <h2>Activities</h2>
            <ul>
                {activities.map((activity) => (
                    <li key={activity._id}>
                        {activity.date} - {activity.location} - {activity.price}$
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReadActivities;
