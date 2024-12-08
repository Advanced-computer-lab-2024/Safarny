import React from 'react';
import styles from "./GuidePage.module.css";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import photo from '/src/client/Assets/Img/test.png';
import profile from '/src/client/Assets/Img/Profile Page.png';
import Ranks from '/src/client/Assets/Img/Ranks.png';
import Bar from '/src/client/Assets/Img/sidebar.png';
import act from '/src/client/Assets/Img/act.png';
import iti from '/src/client/Assets/Img/Iti2.png';
import open from '/src/client/Assets/Img/openevents.png';
import places from '/src/client/Assets/Img/places2.png'; 


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
                                src={profile}
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
                            Familiarize yourself with these essential navigation buttons in the side bar:
                        </p>
                        <div className={styles.imageContainer}>
                            <img
                                src={Bar}
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
                            Click on upcoming Events button then click on Activities:
                        </p>
                        <div className={styles.imageContainer}>
                            <img
                                src={open}
                                alt="Activities section"
                                className={styles.stepImage}
                            />
                        </div>
                        <p className={styles.stepContent}>
                            Here you can see all of your upcoming activities:
                        </p>
                        <div className={styles.imageContainer}>
                            <img
                                src={act}
                                alt="Activities section"
                                className={styles.stepImage}
                            />
                        </div>
                        <div className={styles.tip}>
                            💡 Tip: Check this section regularly for any updates to your scheduled activities.
                        </div>
                    </li>

                    <li className={styles.instructionItem}>
                        <div className={styles.stepHeader}>
                            <span className={styles.stepNumber}>4</span>
                            <h3 className={styles.stepTitle}>Upcoming Itineraries</h3>
                        </div>
                        <p className={styles.stepContent}>
                            Click on upcoming Events button as seen in Upcoming Activities and choose Itineraries
                        </p>
                        <p className={styles.stepContent}>
                            Here you can see all of your upcoming Itineraries 
                        </p>
                        <div className={styles.imageContainer}>
                            <img
                                src={iti}
                                alt="Itineraries section"
                                className={styles.stepImage}
                            />
                        </div>
                        <div className={styles.tip}>
                            💡 Tip: Check this section regularly for any updates to your scheduled itineraries.
                        </div>
                    </li>

                     <li className={styles.instructionItem}>
                        <div className={styles.stepHeader}>
                            <span className={styles.stepNumber}>5</span>
                            <h3 className={styles.stepTitle}>Upcoming Historical Places</h3>
                        </div>
                        <p className={styles.stepContent}>
                        Click on upcoming Events button as seen in Upcoming Activities and choose Historical Places
                        </p>
                        <p className={styles.stepContent}>
                            Here you can see all of your upcoming historical places:
                        </p>
                        <div className={styles.imageContainer}>
                            <img
                                src={places}
                                alt="Historical Places section"
                                className={styles.stepImage}
                            />
                        </div>
                        <div className={styles.tip}>
                            💡 Tip: Check this section regularly for any updates to your scheduled historical places.
                        </div>
                    </li>

                    <li className={styles.instructionItem}>
                        <div className={styles.stepHeader}>
                            <span className={styles.stepNumber}>X</span>
                            <h3 className={styles.stepTitle}>Loyalty Badges</h3>
                        </div>
                        <p className={styles.stepContent}>
                            Here are the Loyalty Badges and what they mean: Level 1 is Lowest after spending than 100,000 points, Level 2 is followed after spending 500,000 points and Level 3 is highest after spending more than 500,000 points
                        </p>
                        <div className={styles.imageContainer}>
                            <img
                                src={Ranks}
                                alt="Activities section"
                                className={styles.stepImage}
                            />
                        </div>
                        {/* <div className={styles.tip}>
                            💡 Tip: Check this section regularly for any updates to your scheduled activities.
                        </div> */}
                    </li>


                    {/* Add remaining steps following the same pattern */}
                </ul>
            </main>
            <Footer />
        </div>
    );
};

export default GuidePage;