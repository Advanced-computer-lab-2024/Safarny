import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaClock, FaTicketAlt, FaMapMarkerAlt, FaCalendar, FaStar } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Header from '/src/client/Components/Header/Header';
import Footer from '/src/client/Components/Footer/Footer';
import styles from './UpcomingActivities.module.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const UpcomingActivitiesDetails = () => {
    const { id } = useParams();
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const response = await axios.get(`/activities/${id}`);
                setActivity(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch activity details');
                setLoading(false);
            }
        };
        fetchActivity();
    }, [id]);

    if (loading) {
        return (
            <div className={styles.pageWrapper}>
                <Header />
                <div className={styles.loadingContainer}>Loading...</div>
            </div>
        );
    }

    if (error || !activity) {
        return (
            <div className={styles.pageWrapper}>
                <Header />
                <div className={styles.errorContainer}>{error || 'Activity not found'}</div>
            </div>
        );
    }

    return (
        <div className={styles.pageWrapper}>
            <Header />
            <div className={styles.detailsContainer}>
                <div className={styles.activityHeader}>
                    <h1>{activity.description}</h1>
                    {/* <div className={styles.rating}>
                        {[...Array(5)].map((_, index) => (
                            <FaStar key={index} className={index < (activity.rating || 0) ? styles.starFilled : styles.starEmpty} />
                        ))}
                    </div> */}
                </div>

                <div className={styles.mainContent}>
                    <div className={styles.mapSection}>
                        {activity.coordinates ? (
                            <MapContainer
                                center={[activity.coordinates.lat, activity.coordinates.lng]}
                                zoom={13}
                                className={styles.map}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <Marker position={[activity.coordinates.lat, activity.coordinates.lng]}>
                                    <Popup>
                                        <div>
                                            <h3>{activity.description}</h3>
                                            <p>{activity.location}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        ) : (
                            <div className={styles.noMap}>Location map not available</div>
                        )}
                    </div>

                    <div className={styles.infoSection}>
                        <div className={styles.priceCard}>
                            <div className={styles.priceHeader}>
                                <span className={styles.price}>{activity.price} AED</span>
                                {activity.specialDiscount && (
                                    <span className={styles.discount}>{activity.specialDiscount} OFF</span>
                                )}
                            </div>
                            <button className={styles.bookButton}>Book Now</button>
                        </div>

                        <div className={styles.detailsCard}>
                            <div className={styles.detailItem}>
                                <FaCalendar className={styles.icon} />
                                <div>
                                    <span className={styles.label}>Date</span>
                                    <span className={styles.value}>
                                        {new Date(activity.date).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.detailItem}>
                                <FaClock className={styles.icon} />
                                <div>
                                    <span className={styles.label}>Time</span>
                                    <span className={styles.value}>{activity.time}</span>
                                </div>
                            </div>

                            <div className={styles.detailItem}>
                                <FaMapMarkerAlt className={styles.icon} />
                                <div>
                                    <span className={styles.label}>Location</span>
                                    <span className={styles.value}>{activity.location}</span>
                                </div>
                            </div>

                            <div className={styles.bookingStatus} data-status={activity.bookingOpen}>
                                {activity.bookingOpen ? "Booking Open" : "Booking Closed"}
                            </div>
                        </div>

                        {activity.tags && activity.tags.length > 0 && (
                            <div className={styles.tagsCard}>
                                <h3>Categories</h3>
                                <div className={styles.tags}>
                                    {activity.tags.map((tag, index) => (
                                        <span key={index} className={styles.tag}>
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default UpcomingActivitiesDetails;