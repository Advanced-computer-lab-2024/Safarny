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
                <p>Please read the following steps carefully:</p>
                <ul>
                    <li>Step 1: Be respectful to the locals</li>
                    <li>Step 2: Look for this monument</li>
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
                    <li>Step 1: Be respectful to the locals</li>
                    <li>Step 1: Be respectful to the locals</li>
                    <li>Step 1: Be respectful to the locals</li>
                    <li>Step 1: Be respectful to the locals</li>
                    <li>Step 1: Be respectful to the locals</li>
                    <li>Step 1: Be respectful to the locals</li>
                    <li>Step x: Don't forget to enjoy ;)</li>
                </ul>
            </main>
            <Footer />
        </div>
    );
};

export default GuidePage;