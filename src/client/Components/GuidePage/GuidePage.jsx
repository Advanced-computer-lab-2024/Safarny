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
                    <li>Step 1: All of your credentials are shown in this page as follows:</li>
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
                    <li>Step 2: Here are all the buttons to use in the header:</li>
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
                        <li>Step 3: Choose the Upcoming Activities button: </li>
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
                    <li>Step 4: Here you can see all the activities that are upcoming:</li>
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
                    <li>Step 5: Alternatively, you can choose the Upcoming Itineraries button:</li>
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
                    <li>Step 6: Here you can see all the itineraries that are upcoming:</li>
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