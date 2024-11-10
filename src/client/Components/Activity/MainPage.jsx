import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import styles from "./MainPage.module.css";

const MainPage = () => {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    return (
        <div className={styles.container}>
          <Header />
          <main className={styles.mainContent}>
            <h1 className={styles.heading}>Main Page</h1>
            {userId && <p className={styles.userIdText}>User ID: {userId}</p>}
            <nav className={styles.nav}>
              <ul className={styles.navList}>
                <li className={styles.navItem}>
                  <Link to={`/create/${userId}`}>
                    <button className={styles.navButton}>Create Activity</button>
                  </Link>
                </li>
                <li className={styles.navItem}>
                  <Link to={`/read/${userId}`}>
                    <button className={styles.navButton}>My Activities</button>
                  </Link>
                </li>
                <li className={styles.navItem}>
                  <Link to={`/update/${userId}`}>
                    <button className={styles.navButton}>Update Activity</button>
                  </Link>
                </li>
                <li className={styles.navItem}>
                  <Link to={`/delete/${userId}`}>
                    <button className={styles.navButton}>Delete Activity</button>
                  </Link>
                </li>
              </ul>
            </nav>
          </main>
          <Footer />
        </div>
      );
      
};

export default MainPage;
