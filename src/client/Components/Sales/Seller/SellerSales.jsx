import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Footer from '/src/client/Components/Footer/Footer';
import Header from '/src/client/Components/Header/Header';
import styles from './SellerSales.module.css';
import { FaChartLine, FaCalendar, FaFilter, FaDollarSign } from 'react-icons/fa';

const SellerSales = () => {
    const location = useLocation();
    const { userId } = location.state || {};
    const [revenue, setRevenue] = useState(0);
    const [filteredRevenue, setFilteredRevenue] = useState(0);
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    const getRevenueBySeller = async (id) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3000/seller/getTotalRevenueByseller/${id}`);
            const data = await response.json();
            setRevenue(data.totalRevenue);
            setError(null);
        } catch (error) {
            setError("Failed to fetch revenue data");
            console.error("Error fetching revenue:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredRevenueBySeller = async (id, month, year) => {
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:3000/seller/filteredRevenueByseller/${id}?month=${month}&year=${year}`
            );
            const data = await response.json();
            setFilteredRevenue(data.totalRevenue);
            setError(null);
        } catch (error) {
            setError("Failed to fetch filtered revenue data");
            console.error("Error fetching filtered revenue:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            getRevenueBySeller(userId);
        }
    }, [userId]);

    const handleSubmit = () => {
        if (userId && (month || year)) {
            filteredRevenueBySeller(userId, month, year);
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <Header />
            
            <main className={styles.mainContent}>
                <div className="container py-4">
                    <div className={styles.pageHeader}>
                        <h1>
                            <FaChartLine className="me-2" />
                            Sales Performance Dashboard
                        </h1>
                        <p className={`text-white-50 ${styles.subheading}`}>Track and analyze your sales performance</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger mb-4">
                            <i className="fas fa-exclamation-circle me-2"></i>
                            {error}
                        </div>
                    )}

                    <div className={styles.summaryCards}>
                        <div className={`${styles.card} ${styles.totalRevenue}`}>
                            <div className={styles.cardIcon}>
                                <FaDollarSign />
                            </div>
                            <h3>Total Revenue</h3>
                            <div className={styles.amount}>
                                ${revenue.toLocaleString()}
                            </div>
                            <p className={`${styles.cardSubtext} text-center`}>Lifetime earnings</p>
                        </div>

                        {filteredRevenue > 0 && (
                            <div className={`${styles.card} ${styles.filteredRevenue}`}>
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
                                <FaFilter className="me-2" />
                                Filter by Period
                            </h3>
                        </div>
                        
                        <div className={styles.filterControls}>
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <select 
                                        className={`form-select ${styles.select}`}
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
                                    <select 
                                        className={`form-select ${styles.select}`}
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
                                        className={`btn ${styles.filterButton}`}
                                        onClick={handleSubmit}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" />
                                                Loading...
                                            </>
                                        ) : (
                                            <>
                                                Generate Report
                                            </>
                                        )}
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

export default SellerSales;
