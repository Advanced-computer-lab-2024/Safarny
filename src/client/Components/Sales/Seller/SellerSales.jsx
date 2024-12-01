import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Footer from '/src/client/Components/Footer/Footer';
import Header from '/src/client/Components/Header/Header';
import styles from './SellerSales.module.css';

const SellerSales = () => {
    const location = useLocation(); // useLocation to get userId
    const { userId } = location.state || {}; // Extract userId from location.state
    const [revenue, setRevenue] = useState(0);
    console.log(userId)
    // Define functions as constants
    const getRevenueBySeller = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/seller/getTotalRevenueByseller/${id}`);
            const data = await response.json();
            setRevenue(data.totalRevenue);
        } catch (error) {
            console.error("Error fetching revenue:", error);
        }
    };



    // useEffect to trigger data fetching
    useEffect(() => {
        if (userId) {
            getRevenueBySeller(userId);
        }
    }, [userId]);

    return (
        <div className={styles.container}>
            <Header />
            <h2 className={styles.heading}>Seller Sales</h2>
            <p className={styles.stat}>Total Merchandise Revenue: {revenue}$</p>
            <Footer />
        </div>
    );
};

export default SellerSales;
