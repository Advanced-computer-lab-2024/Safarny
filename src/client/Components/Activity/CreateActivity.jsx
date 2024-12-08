import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from "./CreateActivity.module.css";
import { FaMapMarkerAlt, FaClock, FaCalendar, FaDollarSign, FaTags } from 'react-icons/fa';

// Fixing marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
});

const CreateActivity = () => {
    const [tags, setTags] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currencyCodes, setCurrencyCodes] = useState([]);
    const [message, setMessage] = useState('');

    const [activityDetails, setActivityDetails] = useState({
        date: '',
        time: '',
        location: '',
        coordinates: { lat: null, lng: null },
        price: '',
        currency: '',
        category: '',
        tags: [],
        specialDiscount: '',
        bookingOpen: true,
        createdby: '',
    });

    useEffect(() => {
        const fetchTagsAndCategories = async () => {
            try {
                const tagResponse = await axios.get('http://localhost:3000/admin/tag');
                setTags(tagResponse.data || []);

                const categoryResponse = await axios.get('http://localhost:3000/advertiser/GetCategories');
                setCategories(categoryResponse.data || []);
            } catch (error) {
                console.error('Error fetching tags or categories:', error);
                setCategories([]);
            }
        };

        const fetchExchangeRates = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_EXCHANGE_API_URL);
                setCurrencyCodes(Object.keys(response.data.conversion_rates));
            } catch (error) {
                console.error('Error fetching exchange rates:', error);
            }
        };

        fetchTagsAndCategories();
        fetchExchangeRates();
    }, []);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setActivityDetails((prevDetails) => ({
                ...prevDetails,
                createdby: storedUserId,
            }));
        }
    }, []);

    const handleChange = (e) => {
        setActivityDetails({ ...activityDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/advertiser', activityDetails);
            setMessage('Activity created successfully!');
        } catch (error) {
            console.error('Error creating activity:', error);
            setMessage('Error creating activity: ' + error.message);
        }
    };

    const LocationMap = () => {
        useMapEvents({
            click(e) {
                setActivityDetails({
                    ...activityDetails,
                    coordinates: { lat: e.latlng.lat, lng: e.latlng.lng },
                });
            },
        });
        return null;
    };

    return (
        <div className={styles.pageWrapper}>
            <Header />
            <main className={styles.mainContent}>
                <div className="container py-4">
                    <div className={styles.formCard}>
                        <div className={styles.formHeader}>
                            <h2>Create New Activity</h2>
                            <p>Fill in the details to create your activity</p>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <div className={styles.inputGroup}>
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="date"
                                                name="date"
                                                value={activityDetails.date}
                                                onChange={handleChange}
                                                required
                                                onClick={(e) => (e.target.type = "date")}
                                                onFocus={(e) => (e.target.type = "date")}
                                                onBlur={(e) => {
                                                    if (!e.target.value) {
                                                        e.target.type = "text";
                                                    }
                                                }}
                                                placeholder="Select date"
                                            />
                                            <label htmlFor="date">Date</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className={styles.inputGroup}>
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="time"
                                                name="time"
                                                value={activityDetails.time}
                                                onChange={handleChange}
                                                required
                                                onClick={(e) => (e.target.type = "time")}
                                                onFocus={(e) => (e.target.type = "time")}
                                                onBlur={(e) => {
                                                    if (!e.target.value) {
                                                        e.target.type = "text";
                                                    }
                                                }}
                                                placeholder="Select time"
                                            />
                                            <label htmlFor="time">Time</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className={styles.inputGroup}>
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="location"
                                                name="location"
                                                value={activityDetails.location}
                                                onChange={handleChange}
                                                placeholder="Enter location"
                                                required
                                            />
                                            <label htmlFor="location">Location</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className={styles.inputGroup}>
                                        <div className="form-floating">
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="price"
                                                name="price"
                                                value={activityDetails.price}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="price">Price</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className={styles.inputGroup}>
                                        <div className="form-floating">
                                            <select
                                                className="form-select"
                                                id="currency"
                                                name="currency"
                                                value={activityDetails.currency}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select currency</option>
                                                {currencyCodes.map((code) => (
                                                    <option key={code} value={code}>{code}</option>
                                                ))}
                                            </select>
                                            <label htmlFor="currency">Currency</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className={styles.inputGroup}>
                                        <div className="form-floating">
                                            <select
                                                className="form-select"
                                                id="category"
                                                name="category"
                                                value={activityDetails.category}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select category</option>
                                                {categories.map((category) => (
                                                    <option key={category._id} value={category._id}>
                                                        {category.type}
                                                    </option>
                                                ))}
                                            </select>
                                            <label htmlFor="category">Category</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className={styles.mapWrapper}>
                                        <label className={styles.mapLabel}>
                                            Select Location on Map
                                        </label>
                                        <div className={styles.mapContainer}>
                                            <MapContainer
                                                center={[51.505, -0.09]}
                                                zoom={13}
                                                style={{ height: '100%', width: '100%' }}
                                            >
                                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                <LocationMap />
                                                {activityDetails.coordinates.lat && (
                                                    <Marker position={[activityDetails.coordinates.lat, activityDetails.coordinates.lng]} />
                                                )}
                                            </MapContainer>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <button type="submit" className={styles.submitButton}>
                                        Create Activity
                                    </button>
                                </div>

                                {message && (
                                    <div className="col-12">
                                        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
                                            {message}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CreateActivity;
