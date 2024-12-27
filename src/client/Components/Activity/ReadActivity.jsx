import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Header from '/src/client/Components/Header/Header';
import Footer from '/src/client/Components/Footer/Footer';
import styles from "./ReadActivity.module.css";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaMapMarkerAlt, FaClock, FaCalendar, FaDollarSign, FaTags, FaShoppingCart } from 'react-icons/fa';

// Fixing Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
});

const ReadActivities = () => {
    const { userId } = useParams();
    const [activities, setActivities] = useState([]);
    const [categories, setCategories] = useState({});
    const [tags, setTags] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [boughtCounts, setBoughtCounts] = useState({});
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await fetch(`/advertiser/activities/user/${userId}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        // No activities found - this is not an error
                        setActivities([]);
                        return;
                    }
                    throw new Error('Network response was not ok');
                }
                
                const data = await response.json();
                
                if (!data || data.length === 0) {
                    // Handle empty data case
                    setActivities([]);
                    return;
                }

                setActivities(data);
                
                // Only fetch counts if we have activities
                const counts = await Promise.all(
                    data.map(async (activity) => {
                        try {
                            const countRes = await fetch(`/advertiser/getClientsByActivity/${activity._id}`);
                            const countData = await countRes.json();
                            return { [activity._id]: countData.boughtCount };
                        } catch {
                            return { [activity._id]: 0 }; // Default to 0 if error occurs
                        }
                    })
                );

                const countsMap = counts.reduce((acc, count) => ({ ...acc, ...count }), {});
                setBoughtCounts(countsMap);
            } catch (error) {
                console.error("Error:", error);
                setErrorMessage("Unable to connect to the server. Please try again later.");
            }
        };
        

        const fetchCategories = async () => {
            try {
                const response = await fetch('/advertiser/GetCategories');
                const data = await response.json();
                const categoryMap = data.reduce((acc, category) => {
                    acc[category._id] = category.type;
                    return acc;
                }, {});
                setCategories(categoryMap);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        const fetchTags = async () => {
            try {
                const response = await fetch('/admin/tag');
                const data = await response.json();
                const tagMap = data.reduce((acc, tag) => {
                    acc[tag._id] = tag.name;
                    return acc;
                }, {});
                setTags(tagMap);
            } catch (error) {
                console.error("Error fetching tags:", error);
            }
        };

        fetchActivities();
        fetchCategories();
        fetchTags();
    }, [userId]);

    return (
        <div className={styles.pageWrapper}>
            <Header />
            <main className={styles.mainContent}>
                <div className="container py-4">
                    <div className={styles.pageHeader}>
                        <div className={styles.headerContainer}>
                            <h1>My Activities</h1>
                            <p className={styles.headerDescription}>
                                View and manage your created activities
                            </p>
                        </div>
                    </div>

                    {errorMessage ? (
                        <div className="alert alert-danger" role="alert">
                            {errorMessage}
                        </div>
                    ) : activities.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyStateContent}>
                                <FaMapMarkerAlt className={styles.emptyStateIcon} />
                                <h3>No Activities Yet</h3>
                                <p>Start creating activities to see them listed here.</p>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.activitiesGrid}>
                            {activities.map((activity) => (
                                <div key={activity._id} className={styles.activityCard}>
                                    <div className={styles.activityHeader}>
                                        <h3 className={styles.activityTitle}>{activity.location}</h3>
                                        <span className={`badge ${activity.bookingOpen ? 'bg-success' : 'bg-danger'}`}>
                                            {activity.bookingOpen ? 'Booking Open' : 'Booking Closed'}
                                        </span>
                                    </div>

                                    <div className={styles.activityDetails}>
                                        <div className={styles.detailRow}>
                                            <FaCalendar />
                                            <span>{activity.date}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <FaClock />
                                            <span>{activity.time}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <FaDollarSign />
                                            <span>{activity.price} {activity.currency}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <FaShoppingCart />
                                            <span>Purchases: {boughtCounts[activity._id] ?? "Loading..."}</span>
                                        </div>
                                    </div>

                                    <div className={styles.categoryTags}>
                                        {activity.category && activity.category.map(catId => (
                                            <span key={catId} className={styles.tag}>
                                                {categories[catId] || "Unknown Category"}
                                            </span>
                                        ))}
                                    </div>

                                    {activity.coordinates && activity.coordinates.lat && (
                                        <div className={styles.mapWrapper}>
                                            <MapContainer
                                                center={[activity.coordinates.lat, activity.coordinates.lng]}
                                                zoom={13}
                                                className={styles.map}
                                            >
                                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                <Marker position={[activity.coordinates.lat, activity.coordinates.lng]}>
                                                    <Popup>
                                                        {activity.location} <br /> ${activity.price}
                                                    </Popup>
                                                </Marker>
                                            </MapContainer>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ReadActivities;
