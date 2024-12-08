import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import styles from "./MainPage.module.css";
import { FaPlus, FaList, FaEdit, FaTrash } from 'react-icons/fa';

const MainPage = () => {
    const actionCards = [
        {
            title: 'Create Activity',
            description: 'Start a new activity or event',
            icon: <FaPlus />,
            path: `/create/${localStorage.getItem('userId')}`,
            color: 'primary'
        },
        {
            title: 'My Activities',
            description: 'View your existing activities',
            icon: <FaList />,
            path: `/read/${localStorage.getItem('userId')}`,
            color: 'success'
        },
        {
            title: 'Update Activity',
            description: 'Modify existing activities',
            icon: <FaEdit />,
            path: `/update/${localStorage.getItem('userId')}`,
            color: 'info'
        },
        {
            title: 'Delete Activity',
            description: 'Remove unwanted activities',
            icon: <FaTrash />,
            path: `/delete/${localStorage.getItem('userId')}`,
            color: 'danger'
        }
    ];

    return (
        <div className={styles.pageWrapper}>
            <Header />
            
            <main className={styles.mainContent}>
                <div className="container">
                    <div className={styles.pageHeader}>
                        <h1>Activity Dashboard</h1>
                        <p className={styles.headerDescription}>
                            Manage your activities with ease
                        </p>
                    </div>

                    <div className={styles.cardContainer}>
                        <div className={styles.cardRow}>
                            {actionCards.slice(0, 2).map((card, index) => (
                                <Link 
                                    to={card.path} 
                                    className={styles.cardLink} 
                                    key={index}
                                >
                                    <div className={`${styles.actionCard} ${styles[card.color]}`}>
                                        <div className={styles.cardIcon}>
                                            {card.icon}
                                        </div>
                                        <h3 className={styles.cardTitle}>
                                            {card.title}
                                        </h3>
                                        <p className={styles.cardDescription}>
                                            {card.description}
                                        </p>
                                        <div className={styles.cardArrow}>→</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className={styles.cardRow}>
                            {actionCards.slice(2, 4).map((card, index) => (
                                <Link 
                                    to={card.path} 
                                    className={styles.cardLink} 
                                    key={index + 2}
                                >
                                    <div className={`${styles.actionCard} ${styles[card.color]}`}>
                                        <div className={styles.cardIcon}>
                                            {card.icon}
                                        </div>
                                        <h3 className={styles.cardTitle}>
                                            {card.title}
                                        </h3>
                                        <p className={styles.cardDescription}>
                                            {card.description}
                                        </p>
                                        <div className={styles.cardArrow}>→</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MainPage;
