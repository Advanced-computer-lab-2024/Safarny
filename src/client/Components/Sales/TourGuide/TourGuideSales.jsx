import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const TourGuideSales = () => {
    const location = useLocation(); // useLocation to get userId
    const { userId } = location.state || {}; // Extract userId from location.state
    const [revenue, setRevenue] = useState(0);
    const [boughtCount, setBoughtCount] = useState(0);
    // Define functions as constants
    
    const getBoughtCountByTourGuide = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/tourguide/getItineraryClients/${id}`);
            const data = await response.json();
            setBoughtCount(data.totalBought);
        } catch (error) {
            console.error("Error fetching revenue:", error);
        }
    };

    const getRevenueByTourGuide = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/tourguide/getItineraryRevenueByTourGuide/${id}`);
            const data = await response.json();
            setRevenue(data.totalRevenue);
        } catch (error) {
            console.error("Error fetching bought count:", error);
        }
    };

    // useEffect to trigger data fetching
    useEffect(() => {
        if (userId) {
            getRevenueByTourGuide(userId);
            getBoughtCountByTourGuide(userId);
        }
    }, [userId]);

    return (
        <div>
            <h2>Tour Guide Sales</h2>
            <p>Total Client Number for all Itineraries: {boughtCount}</p>
            <p>Total Revenue: {revenue}$ </p>
        </div>
    );
};

export default TourGuideSales;
