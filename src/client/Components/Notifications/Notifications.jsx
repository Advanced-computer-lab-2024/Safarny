import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Header from '../Header/Header'; 
import Footer from '../Footer/Footer'; 
import styles from './Notifications.module.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();
  const userId = location.state?.userId || localStorage.getItem('userId');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/notification/getNotifications/${userId}`);
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (userId) fetchNotifications();
  }, [userId]);

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:3000/notification/update/${notificationId}`);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const unreadNotifications = notifications.filter(notification => !notification.read);

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.notificationHeader}>
          <h1 className={styles.heading}>Notifications</h1>
          <span className={styles.notificationCount}>
            {unreadNotifications.length} unread
          </span>
        </div>
        {unreadNotifications.length > 0 ? (
          <ul className={styles.notificationList}>
            {unreadNotifications.map(notification => (
              <li key={notification._id} className={styles.notificationItem}>
                <div className={styles.notificationContent}>
                  <h2 className={styles.title}>{notification.title}</h2>
                  <p className={styles.message}>{notification.message}</p>
                  <p className={styles.timestamp}>
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    className={styles.markAsReadButton}
                    onClick={() => markAsRead(notification._id)}
                  >
                    Mark as Read
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noNotifications}>No unread notifications found.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Notifications;
