import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from '/src/client/Components/Footer/Footer';
import Header from '/src/client/Components/Header/Header';
import styles from './TourGuideSales.module.css';

const TourGuideSales = () => {
    const location = useLocation();
    const { userId } = location.state || {};
    const [revenue, setRevenue] = useState(0);
    const [boughtCount, setBoughtCount] = useState(0);
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [totalTourists, setTotalTourists] = useState(0);

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

    const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026];

    const getRevenueByTourGuide = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/tourguide/getItineraryRevenueByTourGuide/${id}`);
            const data = await response.json();
            setRevenue(data.totalRevenue);
        } catch (error) {
            console.error("Error fetching revenue:", error);
        }
    };

    const getBoughtCountByTourGuide = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/tourguide/getItineraryClients/${id}`);
            const data = await response.json();
            setBoughtCount(data.totalBought);
        } catch (error) {
            console.error("Error fetching bought count:", error);
        }
    };

    const getTouristsByTourGuideAndDate = async (id, month, year) => {
        try {
            const response = await fetch(`http://localhost:3000/tourguide/report/${id}?month=${month}&year=${year}`);
            const data = await response.json();
            const sumOfTourists = data.reduce((total, activity) => total + activity.totalTourists, 0);
            setTotalTourists(sumOfTourists);
        } catch (error) {
            console.error("Error fetching tourists:", error);
        }
    };

    useEffect(() => {
        if (userId) {
            getRevenueByTourGuide(userId);
            getBoughtCountByTourGuide(userId);
        }
    }, [userId]);

    const handleSubmit = () => {
        if (userId && (month || year)) {
            getTouristsByTourGuideAndDate(userId, month, year);
        }
    };

    return (
        <div className={styles.container}>
            <Header />
            <h2 className={styles.heading}>Tour Guide Sales</h2>
            <p className={styles.stat}>Total Client Number for all Itineraries: {boughtCount}</p>
            <p className={styles.stat}>Total Revenue: {revenue}$</p>

            <div className={styles.dropdownContainer}>
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

            <p className={styles.stat}>Total Tourists: {totalTourists}</p>
            <Footer />
        </div>
    );
};

export default TourGuideSales;
