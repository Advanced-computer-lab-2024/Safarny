import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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
    const [message, setMessage] = useState('');

    const [activityDetails, setActivityDetails] = useState({
        date: '',
        time: '',
        location: '',
        coordinates: { lat: null, lng: null },
        price: '',
        category: '',
        tags: [],
        specialDiscount: '',
        bookingOpen: true,
        createdby: '', // Field for userId
    });

    // Fetching tags and categories from backend
    useEffect(() => {
        const fetchTagsAndCategories = async () => {
            try {
                const tagResponse = await axios.get('http://localhost:3000/admin/tag');
                setTags(tagResponse.data || []);

                const categoryResponse = await axios.get('http://localhost:3000/advertiser/GetCategories');
                console.log('Fetched categories:', categoryResponse.data);
                setCategories(categoryResponse.data || []);
            } catch (error) {
                console.error('Error fetching tags or categories:', error);
                setCategories([]);
            }
        };

        fetchTagsAndCategories();
    }, []);

    useEffect(() => {
        // Retrieve userId from localStorage and set it to the createdby field
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setActivityDetails((prevDetails) => ({
                ...prevDetails,
                createdby: storedUserId, // Set createdby to the retrieved userId
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
        <div style={{ padding: '20px' }}>
            <h2>Create Activity</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Date:
                        <input name="date" type="date" value={activityDetails.date} onChange={handleChange} required />
                    </label>
                </div>
                <div>
                    <label>
                        Time:
                        <input name="time" type="time" value={activityDetails.time} onChange={handleChange} required />
                    </label>
                </div>
                <div>
                    <label>
                        Location:
                        <input
                            name="location"
                            type="text"
                            value={activityDetails.location}
                            onChange={handleChange}
                            placeholder="Enter location name"
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Price:
                        <input name="price" type="number" value={activityDetails.price} onChange={handleChange} required />
                    </label>
                </div>
                
                {/* Category Section */}
                <div>
                    <label>
                        Category:
                        <select
                            name="category"
                            value={activityDetails.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            {Array.isArray(categories) && categories.length > 0 ? (
                                categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.type}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No categories available</option>
                            )}
                        </select>
                    </label>
                </div>

                {/* Tags Section */}
                <div>
                    <label>
                        Tags:
                        <select
                            name="tags"
                            multiple
                            value={activityDetails.tags}
                            onChange={(e) =>
                                setActivityDetails({
                                    ...activityDetails,
                                    tags: [...e.target.selectedOptions].map(o => o.value), 
                                })
                            }
                        >
                            {Array.isArray(tags) && tags.length > 0 ? (
                                tags.map((tag) => (
                                    <option key={tag._id} value={tag.name}>
                                        {tag.name}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No tags available</option>
                            )}
                        </select>
                    </label>
                </div>

                <div>
                    <label>
                        Special Discount:
                        <input
                            name="specialDiscount"
                            type="text"
                            value={activityDetails.specialDiscount}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Booking Open:
                        <input
                            type="checkbox"
                            checked={activityDetails.bookingOpen}
                            onChange={(e) => setActivityDetails({ ...activityDetails, bookingOpen: e.target.checked })}
                        />
                    </label>
                </div>

                {/* Map Container for selecting coordinates */}
                <div style={{ height: '400px', width: '100%', marginTop: '20px' }}>
                    <MapContainer center={[activityDetails.coordinates.lat || 51.505, activityDetails.coordinates.lng || -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationMap />
                        {activityDetails.coordinates.lat && activityDetails.coordinates.lng && (
                            <Marker position={[activityDetails.coordinates.lat, activityDetails.coordinates.lng]} />
                        )}
                    </MapContainer>
                </div>

                <button type="submit" style={{ marginTop: '10px' }}>
                    Create Activity
                </button>
                {message && <p style={{ color: 'red' }}>{message}</p>}
            </form>
        </div>
    );
};

export default CreateActivity;
