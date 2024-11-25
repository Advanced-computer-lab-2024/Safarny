import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Footer from '/src/client/components/Footer/Footer';
import Header from '/src/client/components/Header/Header';
import styles from './MyActivities.module.css';

const MyActivities = () => {
  const location = useLocation();
  const { userId } = location.state || {};
  const [searchParams] = useSearchParams();
  const touristId = userId || localStorage.getItem('userId');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserActivities = async () => {
      try {
        const response = await axios.get(`/tourist/${touristId}`);
        console.log("res", response);
        const activityIds = response.data?.activities || [];  
        if (activityIds.length > 0) {
          const uniqueActivityDetails = await Promise.all(
            activityIds.map(async (activityId) => {
              try {
                const activityResponse = await axios.get(`/activities/${activityId}`);
                return activityResponse.data;
              } catch (err) {
                if (err.response && err.response.status === 404) {
                  console.warn(`Activity with ID ${activityId} not found.`);
                  return null;
                } else {
                  throw err;
                }
              }
            })
          );

          const validActivities = uniqueActivityDetails.filter(activity => activity !== null);
          setActivities(validActivities);

          if (validActivities.length === 0) {
            setError('No activities found for this user.');
          }
        } else {
          setError('No activities found for this user.');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to fetch activities');
        setLoading(false);
      }
    };

    if (touristId) {
      fetchUserActivities();
    }
  }, [touristId]);

  if (loading) {
    return <p>Loading activities...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles.container}>
      <Header />
      <h1 className={styles.headerTitle}>My Activities</h1>
      {activities.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {activities.map(activity => (
            <div className={styles.activityCard} key={activity._id}>
             <h3>{activity.name}</h3>
                        <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
                        <p>Time: {activity.time}</p>
                        <p>Location: {activity.location}</p>
                        
                        {activity.tags && activity.tags.length > 0 && (
                            <p>Tags: {activity.tags.map((tag) => tag.name).join(", ")}</p>
                        )}

                        {activity.category && activity.category.length > 0 && (
                            <p>Category: {activity.category.map((cat) => cat.type).join(", ")}</p>
                        )}
                        <p style={{color: activity.bookingOpen ? "green" : "red"}}>
                          {activity.bookingOpen ? "Booking: Open" : "Booking: Closed"}
                        </p>
                       
                        
              <img className={styles.activityImage} src={activity.imageUrl} alt={activity.name} />
            </div>
          ))}
        </div>
      ) : (
        <p>No activities available</p>
      )}
      <Footer />
    </div>
  );
};

export default MyActivities;
