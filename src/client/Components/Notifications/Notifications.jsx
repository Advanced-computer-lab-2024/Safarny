import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();
  const { userId } = location.state;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/notification/getNotifications/${userId}`);
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
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
    <div>
      <h1>Notifications</h1>
      {unreadNotifications.length > 0 ? (
        <ul>
          {unreadNotifications.map(notification => (
            <li key={notification._id}>
              <h2>{notification.title}</h2>
              <p>{notification.message}</p>
              <p>{notification.read ? 'Read' : 'Unread'}</p>
              {!notification.read && (
                <button onClick={() => markAsRead(notification._id)}>Mark as Read</button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No unread notifications found.</p>
      )}
    </div>
  );
};

export default Notifications;