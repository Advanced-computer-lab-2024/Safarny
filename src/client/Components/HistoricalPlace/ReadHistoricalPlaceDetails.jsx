import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Logo from '/src/client/Assets/Img/logo.png';
import Footer from '/src/client/components/Footer/Footer';
import styles from './ReadHistoricalPlaceDetails.module.css';
import Header from '/src/client/components/Header/Header';

const ReadHistoricalPlaceDetails = () => {
    const { id } = useParams();
    const [place, setPlace] = useState(null);
    const [formData, setFormData] = useState({
        description: '',
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
                console.log(`Fetching place with ID: ${id}`); // Log the ID
                const response = await axios.get(`http://localhost:3000/toursimgovernor/places/${id}`);
                setPlace(response.data);
                setFormData(response.data); // Initialize the form with fetched data
                setLoading(false);
            } catch (err) {
                console.error('Error fetching historical place:', err);
                setError('Failed to fetch historical place');
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

    if (!place) {
        return <p>No place details available.</p>;
    }

    return (
        <div className={styles.container}>
            <Header />
            <p>
                Description: {place.description}
            </p>
            <p>Location: {place.location}</p>
            <p>Opening Hours: {place.openingHours}</p>
            <p>Ticket Prices: {place.ticketPrices}</p>
            <p>Pictures: </p>
            {place.pictures && place.pictures.length > 0 && (
                <img className={styles.placeImage} src={place.pictures[0]} alt={place.description} />
            )}
            <Footer />
        </div>
    );
};

export default ReadHistoricalPlaceDetails;