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

    const filteredRevenueByTourGuide = async (id, month, year) => {
        try {
            const response = await fetch(`http://localhost:3000/tourguide/reportsales/${id}?month=${month}&year=${year}`);
            const data = await response.json();
            setFilteredRevenue(data.totalRevenue);
        } catch (error) {
            console.error("Error fetching tourists:", error);
        }
    };

    // useEffect to trigger data fetching
    
    useEffect(() => {
        if (userId) {
            getRevenueByTourGuide(userId);
            getBoughtCountByTourGuide(userId);
        }
    }, [userId]);

    const handleSubmit = () => {
        if (userId && (month || year)) {
            getTouristsByTourGuideAndDate(userId, month, year);
            filteredRevenueByTourGuide(userId, month, year);
        }
    };

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.reportContainer}>
                <h2 className={styles.reportTitle}>Tour Guide Performance Report</h2>
                
                <div className={styles.summaryCards}>
                    <div className={styles.card}>
                        <h3>Total Clients</h3>
                        <div className={styles.amount}>{boughtCount}</div>
                        <div className={styles.period}>All Time</div>
                    </div>

                    <div className={styles.card}>
                        <h3>Total Revenue</h3>
                        <div className={styles.amount}>${revenue.toLocaleString()}</div>
                        <div className={styles.period}>All Time</div>
                    </div>

                    <div className={styles.card}>
                        <h3>Total Tourists</h3>
                        <div className={styles.amount}>{totalTourists}</div>
                        <div className={styles.period}>Selected Period</div>
                    </div>
                </div>

                <div className={styles.filterSection}>
                    <h3>Filter by Period</h3>
                    <div className={styles.filterControls}>
                        <select 
                            className={styles.select}
                            value={month} 
                            onChange={(e) => setMonth(e.target.value)}
                        >
                            <option value="">Select Month</option>
                            {months.map((month) => (
                                <option key={month.value} value={month.value}>
                                    {month.label}
                                </option>
                            ))}
                        </select>

                        <select 
                            className={styles.select}
                            value={year} 
                            onChange={(e) => setYear(e.target.value)}
                        >
                            <option value="">Select Year</option>
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>

                        <button 
                            className={styles.filterButton}
                            onClick={handleSubmit}
                        >
                            Generate Report
                        </button>
                    </div>
                </div>

                {filteredRevenue > 0 && (
                    <div className={styles.summaryCards} style={{ marginTop: '2rem' }}>
                        <div className={styles.card}>
                            <h3>Filtered Revenue</h3>
                            <div className={styles.amount}>${filteredRevenue.toLocaleString()}</div>
                            <div className={styles.period}>
                                {month && months.find(m => m.value === month)?.label} {year}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default TourGuideSales;
