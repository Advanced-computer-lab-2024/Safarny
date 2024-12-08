import React, { useState } from 'react';
import axios from 'axios';
import { Button, Modal } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from "./GuidePage.module.css";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import photo from '/src/client/Assets/Img/Sign up.png';
import photo1 from '/src/client/Assets/Img/Home.png';

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
                        <h2>Getting Started</h2>
                    </div>
                    
                    <div style={{ 
                        backgroundColor: '#333',
                        padding: '15px',
                        borderRadius: '5px',
                        marginBottom: '20px'
                    }}>
                        <p style={{ color: '#fff', margin: 0 }}>
                            Click on Sign up in the Home Page:
                        </p>
                    </div>

                    <img
                            src={photo1}
                            alt="Monument"
                            style={{
                                display: 'block',
                                margin: '10px auto',
                                maxWidth: '100%',
                                height: 'auto'
                            }}
                        />

                    <div className={styles.stepHeader}>
                        <span className={styles.stepNumber}>2</span>
                        <h2>Fill in with your credentials</h2>
                    </div>

                    <div style={{ 
                        backgroundColor: '#333',
                        padding: '15px',
                        borderRadius: '5px',
                        marginBottom: '20px'
                    }}>
                        <p style={{ color: '#fff', margin: 0 }}>
                            All of your credentials and important information should be typed below:
                        </p>
                    </div>

                    <img
                            src={photo}
                            alt="Monument"
                            style={{
                                display: 'block',
                                margin: '10px auto',
                                maxWidth: '100%',
                                height: 'auto'
                            }}
                        />

                    <div className={styles.stepHeader}>
                        <span className={styles.stepNumber}>3</span>
                        <h2>Click on Sign Up</h2>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default GuidePage;