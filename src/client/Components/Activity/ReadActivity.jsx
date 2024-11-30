import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Header from '/src/client/Components/Header/Header';
import Footer from '/src/client/Components/Footer/Footer';
import styles from "./ReadActivity.module.css";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setActivities(data);
                const counts = await Promise.all(
                    data.map(async (activity) => {
                        try {
                            const countRes = await fetch(`http://localhost:3000/advertiser/getClientsByActivity/${activity._id}`);
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
                setErrorMessage("Error fetching activities. Please try again later.");
            }
        };
        

        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:3000/advertiser/GetCategories');
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
                const response = await fetch('http://localhost:3000/admin/tag');
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
        <div className={styles.container}>
            <Header />
            <h2 className={styles.header}>Activities</h2>
            {/* {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>} */}
            {activities.length === 0 ? (
                <p className={styles.noActivitiesMessage}>No activities found for this user.</p>
            ) : (
                <ul className={styles.activitiesList}>
                    {activities.map((activity) => (
                        <li key={activity._id} className={styles.activityItem}>
                            <div className={styles.activityDetails}>
                                <p className={styles.activityText}>
                                    {activity.date} - {activity.location} - ${activity.price} - {activity.time}
                                </p>
                                <p className={styles.activityText}>
                                    Categories: {activity.category && activity.category.length > 0
                                        ? activity.category.map(catId => categories[catId] || "Unknown Category").join(", ")
                                        : "No categories"}
                                </p>
                                <p className={styles.activityText}>
                                    Tags: {activity.tags && activity.tags.length > 0
                                        ? activity.tags.map(tagId => tags[tagId] || "Unknown Tag").join(", ")
                                        : "No tags"}
                                </p>
                                <p className={styles.activityText}>
                                    Special Discount: {activity.specialDiscount}
                                </p>
                                <p className={styles.activityText}>
                                    {activity.bookingOpen ? "Booking Open" : "Booking Closed"}
                                </p>
                                <p className={styles.activityText}>
                                    Purchases: {boughtCounts[activity._id] ?? "Loading..."}
                                </p>
                            </div>
                            
                            {activity.coordinates && activity.coordinates.lat && activity.coordinates.lng && (
                                <MapContainer
                                    center={[activity.coordinates.lat, activity.coordinates.lng]}
                                    zoom={13}
                                    className={styles.mapContainer}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={[activity.coordinates.lat, activity.coordinates.lng]}>
                                        <Popup>
                                            {activity.location} <br /> ${activity.price}
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            <Footer />
        </div>
    );
};

export default ReadActivities;
