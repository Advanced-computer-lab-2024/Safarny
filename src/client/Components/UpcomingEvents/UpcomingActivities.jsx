import React, { useEffect, useState } from 'react';
import styles from './UpcomingActivities.module.css'; // CSS module for styling
import Logo from '/src/client/Assets/Img/logo.png';
import Footer from '/src/client/components/Footer/Footer';
import { Link } from 'react-router-dom';

const UpcomingActivities = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('http://localhost:3000/guest/get-activities-sorted?sortBy=date:asc'); // Adjust the endpoint as needed
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src={Logo} alt="Safarny Logo" className={styles.logo} />
        <h1>Safarny</h1>
        <nav className={styles.nav}>
          <Link to="/" className={styles.button}>Back to Home</Link>
        </nav>
      </header>
      <main className={styles.main}>
        <h2>Upcoming Activities</h2>
        <section className={styles.activityList}>
          {activities.length === 0 ? (
            <p>No upcoming activities found.</p>
          ) : (
            activities.map((activity) => (
              <div key={activity._id} className={styles.activityItem}>
                <h3>{activity.name}</h3>
                <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
                <p>Time: {activity.time}</p>
                <p>Location: {activity.location}</p>
                <p>Coordinates: {JSON.stringify(activity.coordinates)}</p>
                <p>Price: ${activity.price}</p>
                <p>Category: {activity.category}</p>
                {activity.specialDiscount && <p>Discount: {activity.specialDiscount}</p>}
                <p>Tags: {Array.isArray(activity.tags) && activity.tags.name > 0 ? activity.tags.join(', ') : 'No tags available'}</p>
                {/* adjust the category and tag (.name or .length) */}
                <p style={{ color: activity.bookingOpen ? 'green' : 'red' }}>
                  {activity.bookingOpen ? 'Booking Open' : 'Booking Closed'}
                </p>
              </div>
            ))
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default UpcomingActivities;
