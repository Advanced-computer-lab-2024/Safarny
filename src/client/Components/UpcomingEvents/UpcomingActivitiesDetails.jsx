import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Logo from '/src/client/Assets/Img/logo.png';
import Footer from '/src/client/components/Footer/Footer';
import styles from '/src/client/Components/HistoricalPlace/UpdateHistoricalPlace'; // Import the CSS module

const UpcomingActivitiesDetails = () => {
    const { id } = useParams(); // Get activity ID from URL
    const [activity, setActivity] = useState(null);
    const [formData, setFormData] = useState({
        date: '',
        pictures: '',
        location: '',
        openingHours: '',
        ticketPrices: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlaceById = async () => {
            try {
                console.log(`Fetching activity with ID: ${id}`); // Log the ID
                const response = await axios.get(`http://localhost:3000/UpcomingActivities/${id}`);
                setActivity(response.data);
                setFormData(response.data); // Initialize the form with fetched data
                setLoading(false);
            } catch (err) {
                console.error('Error fetching activity:', err);
                setError('Failed to fetch activity');
                setLoading(false);
            }
        };

        fetchPlaceById();
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!activity) {
        return <p>No activity details available.</p>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <img src={Logo} alt="Safarny Logo" className={styles.logo} />
                <h1>            {activity.description}
                </h1>
                <nav className={styles.nav}>
                    <Link to="/" className={styles.button}>Back to Home</Link>
                </nav>
            </header>
            <p>
                Description: {activity.date}
            </p>
            <p>Location: {activity.location}</p>
            <p>Opening Hours: {activity.openingHours}</p>
            <p>Ticket Prices: {activity.ticketPrices}</p>
            <p>Pictures: </p>
            {activity.pictures && activity.pictures.length > 0 && (
                <img className={styles.placeImage} src={activity.pictures[0]} alt={activity.description} />
            )}
            <Footer />
        </div>
    );
};

export default UpcomingActivitiesDetails;