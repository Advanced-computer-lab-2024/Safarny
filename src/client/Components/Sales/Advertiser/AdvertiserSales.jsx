import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Footer from '/src/client/Components/Footer/Footer';
import Header from '/src/client/Components/Header/Header';
import styles from './AdvertiserSales.module.css';
import { FaChartLine, FaCalendar, FaFilter, FaDollarSign } from 'react-icons/fa';

const AdvertiserSales = () => {
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

    const getRevenueByAdvertiser = async (id) => {
        try {
            const response = await fetch(`/advertiser/getRevenueByAdvertiser/${id}`);
            const data = await response.json();
            setRevenue(data.totalRevenue);
        } catch (error) {
            console.error("Error fetching revenue:", error);
        }
    };

    const getBoughtCountByAdvertiser = async (id) => {
        try {
            const response = await fetch(`/advertiser/getnumofclients_activity/${id}`);
            const data = await response.json();
            setBoughtCount(data.totalBought);
        } catch (error) {
            console.error("Error fetching bought count:", error);
        }
    };

    const getTouristsByActivityAndDate = async (id, month, year) => {
        try {
            const response = await fetch(`/advertiser/report/${id}?month=${month}&year=${year}`);
            const data = await response.json();
            const sumOfTourists = data.reduce((total, activity) => total + activity.totalTourists, 0);
            setTotalTourists(sumOfTourists);
        } catch (error) {
            console.error("Error fetching tourists:", error);
        }
    };

    const filteredRevenueByAdvertiser = async (id, month, year) => {
        const response = await fetch(`/advertiser/reportsales/${id}?month=${month}&year=${year}`);
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
        <div className={styles.pageWrapper}>
            <Header />
            
            <main className={styles.mainContent}>
                <div className={styles.container}>
                    <div className={styles.pageHeader}>
                        <div className={styles.headerContent}>
                            <h1>
                                <FaChartLine />
                                <span>Sales Performance Dashboard</span>
                            </h1>
                            <p className={styles.subheading}>Track and analyze your sales performance</p>
                        </div>
                    </div>

                    <div className={styles.summaryCards}>
                        <div className={styles.card}>
                            <div className={styles.cardIcon}>
                                <FaDollarSign />
                            </div>
                            <h3>Total Revenue</h3>
                            <div className={styles.amount}>
                                ${revenue.toLocaleString()}
                            </div>
                            <p className={styles.cardSubtext}>Lifetime earnings</p>
                        </div>

                        {filteredRevenue > 0 && (
                            <div className={styles.card}>
                                <div className={styles.cardIcon}>
                                    <FaCalendar />
                                </div>
                                <h3>Filtered Revenue</h3>
                                <div className={styles.amount}>
                                    ${filteredRevenue.toLocaleString()}
                                </div>
                                <p className={styles.period}>
                                    {month && months.find(m => m.value === month)?.label} {year}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className={styles.filterSection}>
                        <div className={styles.filterHeader}>
                            <h3>
                                <FaFilter />
                                <span>Filter by Period</span>
                            </h3>
                        </div>
                        
                        <div className={styles.filterControls}>
                            <div className={styles.filterGrid}>
                                <div className={styles.filterItem}>
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
                                </div>

                                <div className={styles.filterItem}>
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
                                </div>

                                <div className={styles.filterItem}>
                                    <button 
                                        className={styles.filterButton}
                                        onClick={handleSubmit}
                                    >
                                        Generate Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AdvertiserSales;
