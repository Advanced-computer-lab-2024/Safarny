import React from 'react';
import styles from "./GuidePage.module.css";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import photo from '/src/client/Assets/Img/test.png';
import profile from '/src/client/Assets/Img/Profile Page.png';
import Ranks from '/src/client/Assets/Img/Ranks.png';

const GuidePage = () => {
    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.title}>Welcome to Your Travel Guide</h1>
                <p className={styles.subtitle}>Follow these simple steps to make the most of your journey</p>

                <ul className={styles.instructionList}>
                    <li className={styles.instructionItem}>
                        <div className={styles.stepHeader}>
                            <span className={styles.stepNumber}>1</span>
                            <h3 className={styles.stepTitle}>Getting Started</h3>
                        </div>
                        <p className={styles.stepContent}>
                            All of your credentials and important information are displayed on this page for easy access:
                        </p>
                        <div className={styles.imageContainer}>
                            <img
                                src={photo}
                                alt="Credentials display"
                                className={styles.stepImage}
                            />
                        </div>
                        <div className={styles.tip}>
                            💡 Tip: Keep your credentials handy for quick reference throughout your journey.
                        </div>
                    </li>

                    <li className={styles.instructionItem}>
                        <div className={styles.stepHeader}>
                            <span className={styles.stepNumber}>2</span>
                            <h3 className={styles.stepTitle}>Navigation Guide</h3>
                        </div>
                        <p className={styles.stepContent}>
                            Familiarize yourself with these essential navigation buttons in the header:
                        </p>
                        <div className={styles.imageContainer}>
                            <img
                                src={photo}
                                alt="Header navigation"
                                className={styles.stepImage}
                            />
                        </div>
                    </li>

                    <li className={styles.instructionItem}>
                        <div className={styles.stepHeader}>
                            <span className={styles.stepNumber}>3</span>
                            <h3 className={styles.stepTitle}>Upcoming Activities</h3>
                        </div>
                        <p className={styles.stepContent}>
                            Access your upcoming activities through the dedicated button:
                        </p>
                        <div className={styles.imageContainer}>
                            <img
                                src={photo}
                                alt="Activities section"
                                className={styles.stepImage}
                            />
                        </div>
                        <div className={styles.tip}>
                            💡 Tip: Check this section regularly for any updates to your scheduled activities.
                        </div>
                    </li>

                    {/* Add remaining steps following the same pattern */}
                </ul>
            </main>
            <Footer />
        </div>
    );
};

export default GuidePage;