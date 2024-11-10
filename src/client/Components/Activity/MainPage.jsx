import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '/src/client/Components/Header/Header';
import Footer from '/src/client/Components/Footer/Footer';
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
        <div>
            <Header/>
            <h1 className={styles.heading}>Main Page</h1>
            {userId && <p>User ID: {userId}</p>}
            <nav>
                <ul className={styles.navList}>
                    <li>
                        <Link to={`/create/${userId}`}>
                            <button className={styles.navButton}>Create Activity</button>
                        </Link>
                    </li>
                    <li>
                        <Link to={`/read/${userId}`}>
                            <button className={styles.navButton}>My Activities</button>
                        </Link>
                    </li>
                    <li>
                        <Link to={`/update/${userId}`}>
                            <button className={styles.navButton}>Update Activity</button>
                        </Link>
                    </li>
                    <li>
                        <Link to={`/delete/${userId}`}>
                            <button className={styles.navButton}>Delete Activity</button>
                        </Link>
                    </li>
                </ul>
            </nav>
            <Footer/>
        </div>
    );
};

export default MainPage;
