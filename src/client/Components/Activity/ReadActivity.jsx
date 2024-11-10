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

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await fetch(`/advertiser/activities/user/${userId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log("Activities data:", data);
                setActivities(data);
            } catch (error) {
                console.error("Error fetching activities:", error);
                setErrorMessage("Error fetching activities. Please try again later.");
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:3000/advertiser/GetCategories');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log("Categories data:", data);
                const categoryMap = {};
                data.forEach(category => {
                    categoryMap[category._id] = category.type; // Mapping category ID to type
                });
                console.log("Category Map:", categoryMap); // Log the final category map
                setCategories(categoryMap);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        const fetchTags = async () => {
            try {
                const response = await fetch('http://localhost:3000/admin/tag');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const tagMap = {};
                data.forEach(tag => {
                    tagMap[tag._id] = tag.name;
                });
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
        <div>
            <Header/>
            <h2>Activities</h2>
            {errorMessage && <p>{errorMessage}</p>}
            {activities.length === 0 ? (
                <p>No activities found for this user.</p>
            ) : (
                <ul>
                    {activities.map((activity) => (
                        <li key={activity._id}>
                            {activity.date} - {activity.location} - {activity.price}$ - {activity.time} - 
                            
                            {/* Mapping category IDs to category types */}
                            {activity.category && activity.category.length > 0 
                                ? activity.category.map(catId => {
                                    const categoryType = categories[catId]; // Get category type using ID
                                    return categoryType || "Unknown Category"; // If undefined, return "Unknown Category"
                                  }).join(", ")
                                : "No categories"} - 

                            {activity.tags && activity.tags.length > 0 
                                ? activity.tags.map(tagId => tags[tagId] || "Unknown Tag").join(", ")
                                : "No tags"} - 

                            {activity.specialDiscount} - 

                            {/* Displaying bookingOpen status */}
                            {activity.bookingOpen ? "Booking Open" : "Booking Closed"}

                            {/* Display Leaflet Map for the activity's coordinates if available */}
                            {activity.coordinates && activity.coordinates.lat && activity.coordinates.lng && (
                                <MapContainer
                                    center={[activity.coordinates.lat, activity.coordinates.lng]}
                                    zoom={13}
                                    style={{ height: '300px', width: '100%', marginTop: '10px' }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={[activity.coordinates.lat, activity.coordinates.lng]}>
                                        <Popup>
                                            {activity.location} <br /> {activity.price}$.
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            <Footer/>
        </div>
    );
};

export default ReadActivities;
