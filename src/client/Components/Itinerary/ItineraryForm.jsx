import React, { useState } from 'react';
import './itinerary.module.css'; // Adjust the path if needed

const ItineraryForm = ({ existingItinerary, onSubmit }) => {
    const [formData, setFormData] = useState(existingItinerary || {
        name: '',
        activities: [],
        locations: [],
        startDate: '',
        endDate: '',
        tags: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleActivityChange = (index, e) => {
        const { name, value } = e.target;
        const updatedActivities = [...formData.activities];
        updatedActivities[index] = { ...updatedActivities[index], [name]: value };
        setFormData({ ...formData, activities: updatedActivities });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Itinerary Name" required />
            {/* Repeat similar input fields for locations, startDate, endDate, tags, etc. */}
            {formData.activities.map((activity, index) => (
                <div key={index}>
                    <input type="text" name="name" value={activity.name} onChange={(e) => handleActivityChange(index, e)} placeholder="Activity Name" required />
                    <input type="text" name="location" value={activity.location} onChange={(e) => handleActivityChange(index, e)} placeholder="Activity Location" required />
                    {/* Add more fields as needed */}
                </div>
            ))}
            <button type="submit">Save Itinerary</button>
        </form>
    );
};

export default ItineraryForm;
