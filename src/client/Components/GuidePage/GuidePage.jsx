import React, { useState } from 'react';
import axios from 'axios';
import { Button, Modal } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from "./GuidePage.module.css";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import photo from '/src/client/Assets/Img/test.png';

const GuidePage = () => {
    return (
        <div className={styles.container}>
            <Header />
            <main style={{ flexGrow: 1 }}>
                <h2>Steps to enjoy the trip</h2>
                <p style={{ color: 'white' }}>Please read the following steps carefully:</p>
                <ul style={{ listStyleType: 'none' }}>
                    <li>Steps to follow if you are a tourist:</li>
                    <li>Step 1: Click on Sign Up</li>
                    <li>Step 2: Fill in the required information as seen below:</li>
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
                    <li>Step 3: Read the terms and conditions</li>
                    <li>Step 4: Click on Sign Up</li>
                    <li>Step 5: All of your credentials are shown in this page as follows:</li>
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
                    <li>Step 6: Here are all the buttons to use in the header:</li>
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
                        <li>Step 7: Choose the Upcoming Activities button: </li>
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
                    <li>Step 8: Here you can see all the activities that are upcoming:</li>
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
                    <li>Step 9: Alternatively, you can choose the Upcoming Itineraries button:</li>
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
                    <li>Step 10: Here you can see all the itineraries that are upcoming:</li>
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
                </ul>
            </main>
            <Footer />
        </div>
    );
};

export default GuidePage;