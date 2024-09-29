import React, { useEffect, useState } from 'react';
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

const UpdateActivity = () => {
    const [activities, setActivities] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [message, setMessage] = useState('');

    const [activityDetails, setActivityDetails] = useState({
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

    useEffect(() => {
        const fetchActivities = async () => {
            const response = await axios.get('http://localhost:3000/api/activities');
            setActivities(response.data);
        };

        fetchActivities();
    }, []);

    const handleSelectChange = (e) => {
        const selectedId = e.target.value;
        const activity = activities.find((act) => act._id === selectedId);
        setSelectedActivity(activity);
        setActivityDetails({
            date: activity.date,
            time: activity.time,
            location: activity.location,
            coordinates: activity.coordinates,
            price: activity.price,
            category: activity.category,
            tags: activity.tags.join(', '),
            specialDiscount: activity.specialDiscount,
            bookingOpen: activity.bookingOpen,
        });
    };

    const handleChange = (e) => {
        setActivityDetails({ ...activityDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/api/activities/${selectedActivity._id}`, activityDetails);
            setMessage('Activity updated successfully!');
        } catch (error) {
            console.error('Error updating activity:', error);
            setMessage('Error updating activity: ' + error.message);
        }
    };

    const LocationMap = () => {
        useMapEvents({
            click(e) {
                // Set the coordinates and clear the location field to allow user input
                setActivityDetails({
                    ...activityDetails,
                    coordinates: { lat: e.latlng.lat, lng: e.latlng.lng },
                    // Commenting out the automatic location update
                    // location: `(${e.latlng.lat}, ${e.latlng.lng})`,
                });
            },
        });
        return null;
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Update Activity</h2>
            <div>
                <label>
                    Select Activity:
                    <select onChange={handleSelectChange} value={selectedActivity ? selectedActivity._id : ''}>
                        <option value="">Select an activity</option>
                        {activities.map((activity) => (
                            <option key={activity._id} value={activity._id}>
                                {activity.location} - {activity.date} {activity.time}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {selectedActivity && (
                <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
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
                    <div>
                        <label>
                            Category:
                            <input name="category" type="text" value={activityDetails.category} onChange={handleChange} required />
                        </label>
                    </div>
                    <div>
                        <label>
                            Tags:
                            <input
                                name="tags"
                                type="text"
                                value={activityDetails.tags}
                                onChange={handleChange}
                                placeholder="Comma-separated tags"
                            />
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

                    {/* Map Container at the end */}
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
                        Update Activity
                    </button>
                    {message && <p style={{ color: 'red' }}>{message}</p>}
                </form>
            )}
        </div>
    );
};

export default UpdateActivity;
