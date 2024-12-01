import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const AdvertiserSales = () => {
    const location = useLocation(); // useLocation to get userId
    const { userId } = location.state || {}; // Extract userId from location.state
    const [revenue, setRevenue] = useState(0);
    const [boughtCount, setBoughtCount] = useState(0);
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [totalTourists, setTotalTourists] = useState(0); // To store the sum of totalTourists
    const [filteredRevenue,setFilteredRevenue] = useState(0);
    const months = [
        { label: 'January', value: '1' },
        { label: 'February', value: '2' },
        { label: 'March', value: '3' },
        { label: 'April', value: '4' },
        { label: 'May', value: '5' },
        { label: 'June', value: '6' },
        { label: 'July', value: '7' },
        { label: 'August', value: '8' },
        { label: 'September', value: '9' },
        { label: 'October', value: '10' },
        { label: 'November', value: '11' },
        { label: 'December', value: '12' }
    ];

    const years = [2020,2021,2022,2023, 2024, 2025, 2026]; // Example years, adjust based on your data range

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

    const getTouristsByActivityAndDate = async (id, month, year) => {
        try {
            const response = await fetch(`http://localhost:3000/advertiser/report/${id}?month=${month}&year=${year}`);
            const data = await response.json();
            const sumOfTourists = data.reduce((total, activity) => total + activity.totalTourists, 0);
            console.log("Total tourists:", sumOfTourists);
            setTotalTourists(sumOfTourists); // Set the sum of totalTourists

        } catch (error) {
            console.error("Error fetching tourists:", error);
        }
    };

    const filteredRevenueByAdvertiser = async (id, month, year) => {
        const response = await fetch(`http://localhost:3000/advertiser/reportsales/${id}?month=${month}&year=${year}`);
        const data = await response.json();
        setFilteredRevenue(data.totalRevenue);
    };

    // useEffect to trigger data fetching
    useEffect(() => {
        if (userId) {
            getRevenueByAdvertiser(userId);
            getBoughtCountByAdvertiser(userId);
        }
    }, [userId]);

    const handleSubmit = () => {
        if (userId && (month || year)) {
            getTouristsByActivityAndDate(userId, month, year);
            filteredRevenueByAdvertiser(userId, month, year);
        }
    };

    return (
        <div>
            <h2>Advertiser Sales</h2>
            <p>Total Client Number for all activities: {boughtCount}</p>
            <p>Total Revenue: {revenue}$ </p>

            {/* Dropdowns for Month and Year */}
            <div>
                <select value={month} onChange={(e) => setMonth(e.target.value)}>
                    <option value="">Select Month</option>
                    {months.map((month) => (
                        <option key={month.value} value={month.value}>
                            {month.label}
                        </option>
                    ))}
                </select>

                <select value={year} onChange={(e) => setYear(e.target.value)}>
                    <option value="">Select Year</option>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>

                <button onClick={handleSubmit}>Submit</button>
            </div>

            <p>Total Tourists: {totalTourists}</p> {/* Display the sum of tourists */}
            <p>Filtered Revenue {filteredRevenue}</p>
        </div>
    );
};

export default AdvertiserSales;
