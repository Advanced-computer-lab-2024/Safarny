import React, { useState } from 'react';
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
    const [activity, setActivity] = useState({
        date: '',
        time: '',
        location: '',
        coordinates: { lat: null, lng: null },
        price: '',
        category: '',
        tags: '',
        specialDiscount: '',
        bookingOpen: true,
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setActivity({ ...activity, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/activities', activity);
            setMessage('Activity created successfully!');
        } catch (error) {
            console.error('Error creating activity:', error);
            setMessage('Error creating activity: ' + error.message);
        }
    };

    const LocationMap = () => {
        useMapEvents({
            click(e) {
                setActivity({
                    ...activity,
                    coordinates: { lat: e.latlng.lat, lng: e.latlng.lng },
                    location: `(${e.latlng.lat}, ${e.latlng.lng})`, // Update location based on coordinates
                });
            },
        });
        return null;
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Create Activity</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <div>
                    <label>
                        Date:
                        <input name="date" type="date" onChange={handleChange} required />
                    </label>
                </div>
                <div>
                    <label>
                        Time:
                        <input name="time" type="time" onChange={handleChange} required />
                    </label>
                </div>
                <div>
                    <label>
                        Location:
                        <input
                            name="location"
                            type="text"
                            placeholder="Enter location"
                            value={activity.location}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Price:
                        <input name="price" type="number" placeholder="Price" onChange={handleChange} required />
                    </label>
                </div>
                <div>
                    <label>
                        Category:
                        <input name="category" type="text" placeholder="Category" onChange={handleChange} required />
                    </label>
                </div>
                <div>
                    <label>
                        Tags:
                        <input
                            name="tags"
                            type="text"
                            placeholder="Comma-separated tags"
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Special Discount:
                        <input name="specialDiscount" type="text" placeholder="Special Discount" onChange={handleChange} />
                    </label>
                </div>
                <div>
                    <label>
                        Booking Open:
                        <input
                            type="checkbox"
                            checked={activity.bookingOpen}
                            onChange={(e) => setActivity({ ...activity, bookingOpen: e.target.checked })}
                        />
                    </label>
                </div>
            </form>

            {/* Map Container moved to the end */}
            <div style={{ height: '400px', width: '100%', marginTop: '20px' }}>
                <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMap />
                    {activity.coordinates.lat && activity.coordinates.lng && (
                        <Marker position={[activity.coordinates.lat, activity.coordinates.lng]} />
                    )}
                </MapContainer>
            </div>

            <button type="submit" onClick={handleSubmit} style={{ marginTop: '10px' }}>
                Create Activity
            </button>
            {message && <p style={{ color: 'red' }}>{message}</p>}
        </div>
    );
};

export default CreateActivity;
