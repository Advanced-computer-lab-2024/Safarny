import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '/src/client/Components/Header/Header';
import Footer from '/src/client/Components/Footer/Footer';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from "./CreateActivity.module.css";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

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
        <div className={styles.createActivityContainer}>
            <Header/>
            <h2>Create Activity</h2>

            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label>Date:</label>
                    <input name="date" type="date" value={activityDetails.date} onChange={handleChange} required />
                </div>
                <div className={styles.formGroup}>
                    <label>Time:</label>
                    <input name="time" type="time" value={activityDetails.time} onChange={handleChange} required />
                </div>
                <div className={styles.formGroup}>
                    <label>Location:</label>
                    <input
                        name="location"
                        type="text"
                        value={activityDetails.location}
                        onChange={handleChange}
                        placeholder="Enter location name"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Price:</label>
                    <input name="price" type="number" value={activityDetails.price} onChange={handleChange} required />
                </div>
                <div className={styles.selectContainer}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel style={{ color: 'white' }}>Currency:</InputLabel>
                        <Select
                            name="currency"
                            value={activityDetails.currency}
                            onChange={handleChange}
                            style={{ color: 'white' }}
                        >
                            {currencyCodes.map((code) => (
                                <MenuItem key={code} value={code}>
                                    {code}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className={styles.formGroup}>
                    <label>Category:</label>
                    <select
                        name="category"
                        value={activityDetails.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.type}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label>Tags:</label>
                    <select
                        name="tags"
                        multiple
                        value={activityDetails.tags}
                        onChange={(e) =>
                            setActivityDetails({
                                ...activityDetails,
                                tags: [...e.target.selectedOptions].map((o) => o.value),
                            })
                        }
                    >
                        {tags.map((tag) => (
                            <option key={tag._id} value={tag.name}>
                                {tag.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label>Special Discount:</label>
                    <input
                        name="specialDiscount"
                        type="text"
                        value={activityDetails.specialDiscount}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Booking Open:</label>
                    <input
                        type="checkbox"
                        checked={activityDetails.bookingOpen}
                        onChange={(e) =>
                            setActivityDetails({ ...activityDetails, bookingOpen: e.target.checked })
                        }
                    />
                </div>
                <div style={{ height: '400px', width: '100%', marginTop: '20px' }}>
                    <MapContainer
                        center={[
                            activityDetails.coordinates.lat || 51.505,
                            activityDetails.coordinates.lng || -0.09,
                        ]}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationMap />
                        {activityDetails.coordinates.lat && activityDetails.coordinates.lng && (
                            <Marker position={[activityDetails.coordinates.lat, activityDetails.coordinates.lng]} />
                        )}
                    </MapContainer>
                </div>
                <button type="submit" className={styles.submitButton}>
                    Create Activity
                </button>
                {message && <p className={styles.message}>{message}</p>}
            </form>
            <Footer/>
        </div>
    );
};

export default CreateActivity;
