import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Logo from '/src/client/Assets/Img/logo.png';
import Footer from '/src/client/components/Footer/Footer';
import Header from '/src/client/components/Header/Header';
import styles from './UpcomingActivities.module.css';

const UpcomingActivitiesDetails = () => {
    const { id } = useParams(); // Get activity ID from URL
    const [activity, setActivity] = useState(null);
    const [formData, setFormData] = useState({
        date: '',
        pictures: '',
        location: '',
        openingHours: '',
        ticketPrices: '',
        time: '',
        category: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const renderStars = (rating) => {
        if (rating == null) return null;
        const stars = [];
        for (let i = 0; i < rating; i++) {
            stars.push(<span key={i}>&#9733;</span>); // Shaded star
        }
        return stars;
    };

    useEffect(() => {
        const fetchPlaceById = async () => {
            try {
                console.log(`Fetching activity with ID: ${id}`); // Log the ID
                const response = await axios.get(`http://localhost:3000/activities/${id}`);
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
    //Dont forget to add the currency type in the paragraph

    return (
        <div className={styles.container}>
            <Header/>
            <header className={styles.header}>
            </header>
            <p>The following activity commences
                on {new Date(activity.date).toLocaleDateString()} at {activity.time}.</p>
            <p>Price: {activity.price}</p>
            <p>Rating: {renderStars(activity.rating)}</p>            <p> {activity.specialDiscount && (
            <p>Discount: {activity.specialDiscount}</p>
        )}</p>
            {/* Display Tags */}
            {activity.tags && activity.tags.length > 0 && (
                <p>Tags: {activity.tags.map((tag) => tag.name).join(", ")}</p>
            )}
            {/* Display Categories */}
            {/*<p>
                    Category: {activity.category.map((cat) => cat.type).join(", ")}
                </p>*/}
            <p>Location: {activity.location}</p>
            <p style={{color: activity.bookingOpen ? "green" : "red"}}>
                {activity.bookingOpen ? "Booking: Open" : "Booking: Closed"}
            </p>
            <Footer/>
        </div>
    );
};

export default UpcomingActivitiesDetails;