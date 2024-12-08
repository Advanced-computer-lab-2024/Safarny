import React, { useState } from 'react';
import axios from 'axios';
import { Button, Modal } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
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
            <main className={styles.mainContent} style={{ flexGrow: 1 }}>
                <h1 style={{ 
                    textAlign: 'center', 
                    borderBottom: '2px solid #2196f3',
                    paddingBottom: '10px',
                    marginBottom: '30px'
                }}>
                    Welcome to Your Travel Guide
                </h1>
                
                <div style={{ 
                    backgroundColor: '#333',
                    padding: '15px',
                    borderRadius: '5px',
                    marginBottom: '30px'
                }}>
                    <p style={{ color: '#fff', margin: 0 }}>
                        Follow these simple steps to make the most of your journey
                    </p>
                </div>

                <div className={styles.stepSection}>
                    <div className={styles.stepHeader}>
                        <span className={styles.stepNumber}>1</span>
                        <h2>Profile Information</h2>
                    </div>
                    <p style={{ color: 'white' }}>All of your credentials are shown in this page as follows:</p>
                    <img src={profile} alt="Profile" style={{
                        display: 'block',
                        margin: '10px auto',
                        maxWidth: '100%',
                        height: 'auto'
                    }} />

                    <div className={styles.stepHeader}>
                        <span className={styles.stepNumber}>2</span>
                        <h2>Navigation Guide</h2>
                    </div>
                    <p style={{ color: 'white' }}>Here are all the buttons to use in the header:</p>
                    <img src={photo} alt="Navigation" style={{
                        display: 'block',
                        margin: '10px auto',
                        maxWidth: '100%',
                        height: 'auto'
                    }} />

                    <div className={styles.stepHeader}>
                        <span className={styles.stepNumber}>3</span>
                        <h2>Upcoming Activities</h2>
                    </div>
                    <p style={{ color: 'white' }}>Choose the Upcoming Activities button to view all upcoming events:</p>
                    <img src={photo} alt="Activities" style={{
                        display: 'block',
                        margin: '10px auto',
                        maxWidth: '100%',
                        height: 'auto'
                    }} />

                    <div className={styles.stepHeader}>
                        <span className={styles.stepNumber}>4</span>
                        <h2>Loyalty Program</h2>
                    </div>
                    <p style={{ color: 'white' }}>Here are the Loyalty Badges and what they mean:</p>
                    <img src={Ranks} alt="Ranks" style={{
                        display: 'block',
                        margin: '10px auto',
                        maxWidth: '100%',
                        height: 'auto'
                    }} />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default GuidePage;