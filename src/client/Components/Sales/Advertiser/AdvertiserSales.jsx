import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const AdvertiserSales = () => {
    const location = useLocation(); // useLocation to get userId
    const { userId } = location.state || {}; // Extract userId from location.state
    const [revenue, setRevenue] = useState(0);
    const [boughtCount, setBoughtCount] = useState(0);
    // Define functions as constants
    const getRevenueByAdvertiser = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/advertiser/getRevenueByAdvertiser/${id}`);
            const data = await response.json();
            setRevenue(data.totalRevenue);
        } catch (error) {
            console.error("Error fetching revenue:", error);
        }
    };

    const getBoughtCountByAdvertiser = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/advertiser/getnumofclients_activity/${id}`);
            const data = await response.json();
            setBoughtCount(data.totalBought);
        } catch (error) {
            console.error("Error fetching bought count:", error);
        }
    };

    // useEffect to trigger data fetching
    useEffect(() => {
        if (userId) {
            getRevenueByAdvertiser(userId);
            getBoughtCountByAdvertiser(userId);
        }
    }, [userId]);

    return (
        <div>
            <h2>Advertiser Sales</h2>
            <p>Total Client Number for all activites: {boughtCount}</p>
            <p>Total Revenue: {revenue}$ </p>
        </div>
    );
};

export default AdvertiserSales;
