import React, { useEffect, useState } from 'react';
import Footer from '/src/client/Components/Footer/Footer';
import Header from '/src/client/Components/Header/Header';
import SideBar from '../../SideBar/SideBar';
import { Container, Row, Col, Card } from 'react-bootstrap';
import styles from "./Sales.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const Sales = () => {
    const [totalRev, setTotalRev] = useState(0);
    const [activityRev, setActivityRev] = useState(0);
    const [itineraryRev, setItineraryRev] = useState(0);
    const [filteredRevenue, setFilteredRevenue] = useState(0);
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

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

    useEffect(() => {
        const fetchAllRevenue = async () => {
            try {
                const [totalResponse, activityResponse, itineraryResponse] = await Promise.all([
                    fetch('http://localhost:3000/admin/getAllRevenue'),
                    fetch('http://localhost:3000/admin/getActivitiesRevenue'),
                    fetch('http://localhost:3000/admin/getItinerarayRevenue')
                ]);

                const totalData = await totalResponse.json();
                const activityData = await activityResponse.json();
                const itineraryData = await itineraryResponse.json();

                setTotalRev(totalData.totalRevenue);
                setActivityRev(activityData.totalRevenue);
                setItineraryRev(itineraryData.totalRevenue);
            } catch (error) {
                console.error("Error fetching revenue:", error);
            }
        };

        fetchAllRevenue();
    }, []);

    const handleSubmit = async () => {
        if (month || year) {
            try {
                const response = await fetch(`http://localhost:3000/admin/filteredrevenueadmin?month=${month}&year=${year}`);
                const data = await response.json();
                setFilteredRevenue(data.totalRevenue);
            } catch (error) {
                console.error("Error fetching filtered revenue:", error);
            }
        }
    };

    return (
        <div className={styles.container} style={{ width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            
            <div className={styles.contentWrapper}>
                <SideBar />
                
                <Container fluid className={styles.reportContainer}>
                    <Card className={styles.headerCard}>
                        <Card.Body>
                            <h2 className={styles.heading}>System Revenue Analytics</h2>
                            <p className={styles.subHeading}>Comprehensive financial overview of all revenue streams</p>
                        </Card.Body>
                    </Card>

                    <div className={styles.statsGrid}>
                        <Card className={`${styles.statCard} ${styles.primaryCard}`}>
                            <Card.Body>
                                <h3 className={styles.statLabel}>Total Merchandise Revenue</h3>
                                <div className={styles.statValue}>${totalRev.toLocaleString()}</div>
                            </Card.Body>
                        </Card>
                        
                        <Card className={`${styles.statCard} ${styles.secondaryCard}`}>
                            <Card.Body>
                                <h3 className={styles.statLabel}>Activity Revenue</h3>
                                <div className={styles.statValue}>${activityRev.toLocaleString()}</div>
                            </Card.Body>
                        </Card>
                        
                        <Card className={`${styles.statCard} ${styles.tertiaryCard}`}>
                            <Card.Body>
                                <h3 className={styles.statLabel}>Itinerary Revenue</h3>
                                <div className={styles.statValue}>${itineraryRev.toLocaleString()}</div>
                            </Card.Body>
                        </Card>

                        <Card className={`${styles.statCard} ${styles.totalCard}`}>
                            <Card.Body>
                                <h3 className={styles.statLabel}>Total System Revenue</h3>
                                <div className={styles.statValue}>${(itineraryRev + activityRev + totalRev).toLocaleString()}</div>
                            </Card.Body>
                        </Card>
                    </div>

                    <Card className={styles.formGroup}>
                        <Card.Body>
                            <h3 className={styles.filterTitle}>Revenue Filter</h3>
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
                                
                                <button className={styles.button} onClick={handleSubmit}>
                                    Generate Report
                                </button>
                            </div>
                        </Card.Body>
                    </Card>

                    {filteredRevenue > 0 && (
                        <Card className={`${styles.statCard} ${styles.resultCard}`}>
                            <Card.Body>
                                <h3 className={styles.statLabel}>Filtered Period Revenue</h3>
                                <div className={styles.statValue}>${filteredRevenue.toLocaleString()}</div>
                            </Card.Body>
                        </Card>
                    )}
                </Container>
            </div>

            <Footer />
        </div>
    );
};

export default Sales;
