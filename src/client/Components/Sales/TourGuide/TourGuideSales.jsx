import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from '/src/client/Components/Footer/Footer';
import Header from '/src/client/Components/Header/Header';
import styles from './TourGuideSales.module.css';
import { FaChartLine, FaUsers, FaDollarSign, FaCalendarAlt } from 'react-icons/fa';

const TourGuideSales = () => {
    const location = useLocation();
    const { userId } = location.state || {};
    const [revenue, setRevenue] = useState(0);
    const [boughtCount, setBoughtCount] = useState(0);
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [totalTourists, setTotalTourists] = useState(0);
    const [filteredRevenue, setFilteredRevenue] = useState(0);

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
            const response = await fetch(`/tourguide/getItineraryRevenueByTourGuide/${id}`);
            const data = await response.json();
            setRevenue(data.totalRevenue);
        } catch (error) {
            console.error("Error fetching revenue:", error);
        }
    };

    const getBoughtCountByTourGuide = async (id) => {
        try {
            const response = await fetch(`/tourguide/getItineraryClients/${id}`);
            const data = await response.json();
            setBoughtCount(data.totalBought);
        } catch (error) {
            console.error("Error fetching bought count:", error);
        }
    };

    const getTouristsByTourGuideAndDate = async (id, month, year) => {
        try {
            const response = await fetch(`/tourguide/report/${id}?month=${month}&year=${year}`);
            const data = await response.json();
            const sumOfTourists = data.reduce((total, activity) => total + activity.totalTourists, 0);
            setTotalTourists(sumOfTourists);
        } catch (error) {
            console.error("Error fetching tourists:", error);
        }
    };

    const filteredRevenueByTourGuide = async (id, month, year) => {
        try {
            const response = await fetch(`/tourguide/reportsales/${id}?month=${month}&year=${year}`);
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
        <div className={styles.pageWrapper}>
            <Header />
            <main className={styles.mainContent} style={{ width: '100vw' }}>
                <div className={styles.dashboardHeader}>
                    <div className={`${styles.headerContainer} container text-center`}>
                        <h1 className={styles.mainTitle}>
                            <span className={styles.titleWrapper}>
                                <FaChartLine className="me-2" />
                                Sales Performance Dashboard
                            </span>
                        </h1>
                        <div className={styles.subtitleWrapper}>
                            <p className={styles.subtitle}>Track your tour guide performance and revenue metrics</p>
                        </div>
                    </div>
                </div>

                <div className="container py-4">
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className={`${styles.statsCard} ${styles.clientsCard}`}>
                                <div className={styles.cardIcon}>
                                    <FaUsers />
                                </div>
                                <div className={styles.cardContent}>
                                    <h3>Total Clients</h3>
                                    <div className={styles.amount}>{boughtCount}</div>
                                    <div className={styles.period}>All Time</div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className={`${styles.statsCard} ${styles.revenueCard}`}>
                                <div className={styles.cardIcon}>
                                    <FaDollarSign />
                                </div>
                                <div className={styles.cardContent}>
                                    <h3>Total Revenue</h3>
                                    <div className={styles.amount}>${revenue.toLocaleString()}</div>
                                    <div className={styles.period}>All Time</div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className={`${styles.statsCard} ${styles.touristsCard}`}>
                                <div className={styles.cardIcon}>
                                    <FaUsers />
                                </div>
                                <div className={styles.cardContent}>
                                    <h3>Total Tourists</h3>
                                    <div className={styles.amount}>{totalTourists}</div>
                                    <div className={styles.period}>Selected Period</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.filterSection} mt-5`}>
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h3 className={styles.filterTitle}>
                                    <FaCalendarAlt className="me-2" />
                                    Filter by Period
                                </h3>
                                <div className="row g-3 align-items-end">
                                    <div className="col-md-4">
                                        <label className={styles.filterLabel}>Month</label>
                                        <select 
                                            className="form-select"
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

                                    <div className="col-md-4">
                                        <label className={styles.filterLabel}>Year</label>
                                        <select 
                                            className="form-select"
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

                                    <div className="col-md-4">
                                        <button 
                                            className={`btn btn-primary w-100 ${styles.generateButton}`}
                                            onClick={handleSubmit}
                                        >
                                            Generate Report
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {filteredRevenue > 0 && (
                        <div className={`${styles.filteredResults} mt-4`}>
                            <div className={`${styles.statsCard} ${styles.filteredRevenueCard}`}>
                                <div className={styles.cardIcon}>
                                    <FaDollarSign />
                                </div>
                                <div className={styles.cardContent}>
                                    <h3>Filtered Revenue</h3>
                                    <div className={styles.amount}>${filteredRevenue.toLocaleString()}</div>
                                    <div className={styles.period}>
                                        {month && months.find(m => m.value === month)?.label} {year}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TourGuideSales;
