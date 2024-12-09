import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaClock, FaTicketAlt, FaMapMarkerAlt, FaTags } from 'react-icons/fa';
import Logo from '/src/client/Assets/Img/logo.png';
import Footer from '/src/client/components/Footer/Footer';
import styles from './ReadHistoricalPlaceDetails.module.css';
import Header from '/src/client/components/Header/Header';

const ReadHistoricalPlaceDetails = () => {
    const { id } = useParams();
    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        const fetchPlaceById = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/toursimgovernor/places/${id}`);
                setPlace(response.data);
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
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p>Loading place details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    if (!place) {
        return <div className={styles.errorMessage}>No place details available.</div>;
    }

    return (
        <div className={styles.pageWrapper}>
            <Header />
            <div className={styles.contentContainer}>
                <div className={styles.productLayout}>
                    {/* Left side - Image Gallery */}
                    <div className={styles.imageGallery}>
                        <div className={styles.mainImageContainer}>
                            {place.pictures && place.pictures.length > 0 ? (
                                <img
                                    className={styles.mainImage}
                                    src={place.pictures[selectedImage]}
                                    alt={`${place.description}`}
                                />
                            ) : (
                                <div className={styles.noImage}>No image available</div>
                            )}
                            <div className={styles.imageControls}>
                                {place.pictures?.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`${styles.dot} ${selectedImage === index ? styles.activeDot : ''}`}
                                        onClick={() => setSelectedImage(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right side - Details */}
                    <div className={styles.detailsContainer}>
                        <h1 className={styles.title}>{place.description}</h1>
                        
                        <div className={styles.priceSection}>
                            <span className={styles.price}>
                                {place.ticketPrices} {place.currency}
                            </span>
                            <button className={styles.bookButton}>
                                Book Now
                            </button>
                        </div>

                        <div className={styles.infoSection}>
                            <div className={styles.infoRow}>
                                <FaClock className={styles.icon} />
                                <div>
                                    <span className={styles.label}>Opening Hours</span>
                                    <span className={styles.value}>{place.openingHours}</span>
                                </div>
                            </div>

                            <div className={styles.infoRow}>
                                <FaMapMarkerAlt className={styles.icon} />
                                <div>
                                    <span className={styles.label}>Location</span>
                                    <span className={styles.value}>
                                        {place.coordinates?.lat}, {place.coordinates?.lng}
                                    </span>
                                </div>
                            </div>

                            {place.tagNames && place.tagNames.length > 0 && (
                                <div className={styles.tagSection}>
                                    <span className={styles.label}>Categories</span>
                                    <div className={styles.tagContainer}>
                                        {place.tagNames.map((tag, index) => (
                                            <span key={index} className={styles.tag}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.descriptionCard}>
                    <h2>About this place</h2>
                    <p>{place.description}</p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ReadHistoricalPlaceDetails;