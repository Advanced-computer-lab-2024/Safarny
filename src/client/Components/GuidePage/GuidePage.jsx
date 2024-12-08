import React from 'react';
import styles from "./GuidePage.module.css";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import profile from '/src/client/Assets/Img/profile.png';
import Ranks from '/src/client/Assets/Img/Ranks.png';
import Bar from '/src/client/Assets/Img/sidebar.png';
import act from '/src/client/Assets/Img/act.png';
import iti from '/src/client/Assets/Img/Iti2.png';
import places from '/src/client/Assets/Img/places2.png'; 
import open2 from '/src/client/Assets/Img/open2.png';
import create from '/src/client/Assets/Img/create2.png';
import view from '/src/client/Assets/Img/view2.png';
import products from '/src/client/Assets/Img/products2.png';
import orders from '/src/client/Assets/Img/orders.png';
import update from '/src/client/Assets/Img/update2.png';
import flight from '/src/client/Assets/Img/flight2.png';
import hotel from '/src/client/Assets/Img/hotel2.png';
import trans from '/src/client/Assets/Img/trans2.png';
import book from '/src/client/Assets/Img/mybooks2.png';
import open1 from '/src/client/Assets/Img/open1.png';
import open3 from '/src/client/Assets/Img/open3.png';
import open4 from '/src/client/Assets/Img/open4.png';
import pref from '/src/client/Assets/Img/pref.png';
import search from '/src/client/Assets/Img/search2.png';

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
                                src={open1}
                                alt="Sidebar navigation"
                                className={styles.stepImage}
                            />
                        </div>
                    </li>

                    <li className={styles.instructionItem}>
                        <div className={styles.stepHeader}>
                            <span className={styles.stepNumber}>3</span>
                            <h3 className={styles.stepTitle}>Products</h3>
                        </div>
                        <p className={styles.stepContent}>
                            Click on Products
                        </p>
                        <p className={styles.stepContent}>
                            Here you can check all of the products:
                        </p>
                        <div className={styles.imageContainer}>
                            <img
                                src={products}
                                alt="View Complaints section"
                                className={styles.stepImage}
                            />
                        </div>
                    </li>

                    <li className={styles.instructionItem}>
                        <div className={styles.stepHeader}>
                            <span className={styles.stepNumber}>4</span>
                            <h3 className={styles.stepTitle}>Search</h3>
                        </div>
                        <p className={styles.stepContent}>
                            Click on Search
                        </p>
                        <p className={styles.stepContent}>
                            Here you can search by certain category:
                        </p>
                        <div className={styles.imageContainer}>
                            <img
                                src={search}
                                alt="View Complaints section"
                                className={styles.stepImage}
                            />
                        </div>
                    </li>

                    <li className={styles.instructionItem}>
                        <div className={styles.stepHeader}>
                            <span className={styles.stepNumber}>5</span>
                            <h3 className={styles.stepTitle}>Update Profile</h3>
                        </div>
                        <p className={styles.stepContent}>
                            Click on Update Profile
                        </p>
                        <p className={styles.stepContent}>
                            Here you can edit your credintials how ever you want:
                        </p>
                        <div className={styles.imageContainer}>
                            <img
                                src={update}
                                alt="View Complaints section"
                                className={styles.stepImage}
                            />
                        </div>
                    </li>

                    <li className={styles.instructionItem}>
                        <div className={styles.stepHeader}>
                            <span className={styles.stepNumber}>6</span>
                            <h3 className={styles.stepTitle}>Upcoming Activities</h3>
                        </div>
                        <p className={styles.stepContent}>
                            Click on upcoming Events button then click on Activities:
                        </p>
                        <div className={styles.imageContainer}>
                            <img
                                src={open2}
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
                            <span className={styles.stepNumber}>7</span>
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
                            <span className={styles.stepNumber}>8</span>
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
                            <span className={styles.stepNumber}>9</span>
                            <h3 className={styles.stepTitle}>Create Complaints</h3>
                        </div>
                        <p className={styles.stepContent}>
                            Click on Complaints button then click on create complaints:
                        </p>
                        <div className={styles.imageContainer}>
                            <img
                                src={open3}
                                alt="Create Complaints section"
                                className={styles.stepImage}
                            />
                        </div>
                        <p className={styles.stepContent}>
                            Here you can write any complaints you might have:
                        </p>
                        <div className={styles.imageContainer}>
                            <img
                                src={create}
                                alt="Create Complaints section"
                                className={styles.stepImage}
                            />
                        </div>
                    </li>

                    <li className={styles.instructionItem}>
                        <div className={styles.stepHeader}>
                            <span className={styles.stepNumber}>10</span>
                            <h3 className={styles.stepTitle}>View Complaints</h3>
                        </div>
                        <p className={styles.stepContent}>
                            Click on Complaints button as seen in Create Complaints and choose View Complaints
                        </p>
                        <p className={styles.stepContent}>
                            Here you can see all of your complaints
                        </p>
                        <div className={styles.imageContainer}>
                            <img
                                src={view}
                                alt="View Complaints section"
                                className={styles.stepImage}
                            />
                        </div>
                    </li>

                    <li className={styles.instructionItem}>
                        <div className={styles.stepHeader}>
                            <span className={styles.stepNumber}>11</span>
                            <h3 className={styles.stepTitle}>Book Flight</h3>
                        </div>
                        <p className={styles.stepContent}>
                            Click on Bookings and Services button then click on Book Flight:
                        </p>
                        <div className={styles.imageContainer}>
                            <img
                                src={open4}
                                alt="Flight section"
                                className={styles.stepImage}
                            />
                        </div>
                        <p className={styles.stepContent}>
                            Here you can book all your flights:
                        </p>
                        <div className={styles.imageContainer}>
                            <img
                                src={flight}
                                alt="Create Complaints section"
                                className={styles.stepImage}
                            />
                        </div>
                    </li>

                    <li className={styles.instructionItem}>
                        <div className={styles.stepHeader}>
                            <span className={styles.stepNumber}>12</span>
                            <h3 className={styles.stepTitle}>Book Hotel</h3>
                        </div>
                        <p className={styles.stepContent}>
                            Click on Bookings and services button as seen in Book Flight and choose Book Hotels
                        </p>
                        <p className={styles.stepContent}>
                            Here you can book in the hotel that you want:
                        </p>
                        <div className={styles.imageContainer}>
                            <img
                                src={hotel}
                                alt="View Complaints section"
                                className={styles.stepImage}
                            />
                        </div>
                    </li>

                    <li className={styles.instructionItem}>
                        <div className={styles.stepHeader}>
                            <span className={styles.stepNumber}>13</span>
                            <h3 className={styles.stepTitle}>Book Transport</h3>
                        </div>
                        <p className={styles.stepContent}>
                            Click on Bookings and services button as seen in Book Flight and choose Book Transport
                        </p>
                        <p className={styles.stepContent}>
                            Here you can book the means of transport that you want:
                        </p>
                        <div className={styles.imageContainer}>
                            <img
                                src={trans}
                                alt="View Complaints section"
                                className={styles.stepImage}
                            />
                        </div>
                    </li>

                    <li className={styles.instructionItem}>
                        <div className={styles.stepHeader}>
                            <span className={styles.stepNumber}>14</span>
                            <h3 className={styles.stepTitle}>My Bookings</h3>
                        </div>
                        <p className={styles.stepContent}>
                            Click on Bookings and services button as seen in Book Flight and choose My Bookings
                        </p>
                        <p className={styles.stepContent}>
                            Here you can view all of your bookings:
                        </p>
                        <div className={styles.imageContainer}>
                            <img
                                src={book}
                                alt="View Complaints section"
                                className={styles.stepImage}
                            />
                        </div>
                    </li>

                    <li className={styles.instructionItem}>
                        <div className={styles.stepHeader}>
                            <span className={styles.stepNumber}>15</span>
                            <h3 className={styles.stepTitle}>My Orders</h3>
                        </div>
                        <p className={styles.stepContent}>
                            Click on Bookings and services button as seen in Book Flight and choose My Orders
                        </p>
                        <p className={styles.stepContent}>
                            Here you can view all of your orders:
                        </p>
                        <div className={styles.imageContainer}>
                            <img
                                src={orders}
                                alt="View Complaints section"
                                className={styles.stepImage}
                            />
                        </div>
                    </li>

                    <li className={styles.instructionItem}>
                        <div className={styles.stepHeader}>
                            <span className={styles.stepNumber}>16</span>
                            <h3 className={styles.stepTitle}>My Preferences</h3>
                        </div>
                        <p className={styles.stepContent}>
                            Click on Bookings and services button as seen in Book Flight and choose My Preferences
                        </p>
                        <p className={styles.stepContent}>
                            Here you can selected your preferences:
                        </p>
                        <div className={styles.imageContainer}>
                            <img
                                src={pref}
                                alt="View Complaints section"
                                className={styles.stepImage}
                            />
                        </div>
                    </li>

                    <li className={styles.instructionItem}>
                        <div className={styles.stepHeader}>
                            <span className={styles.stepNumber}>17</span>
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
                    </li>


                    {/* Add remaining steps following the same pattern */}
                </ul>
            </main>
            <Footer />
        </div>
    );
};

export default GuidePage;