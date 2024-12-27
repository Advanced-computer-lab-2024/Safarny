import React, { useEffect, useState } from 'react';
import ItineraryForm from './ItineraryForm';
import ItineraryList from './ItineraryList';
import './itinerary.module.css'; // Ensure the CSS file path is correct

const ItineraryManager = () => {
    const [itineraries, setItineraries] = useState([]);

    // Fetch itineraries when the component mounts
    useEffect(() => {
        const fetchItineraries = async () => {
            const response = await fetch('/iternary/get'); // Adjust the URL if needed
            const data = await response.json();
            setItineraries(data);
        };

        fetchItineraries();
    }, []);

    // Function to handle form submission
    const handleFormSubmit = async (formData) => {
        // Send the new itinerary data to the server
        const response = await fetch('/touristItinerary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        // If successful, refresh the itinerary list
        if (response.ok) {
            const newItinerary = await response.json();
            setItineraries([...itineraries, newItinerary]);
        }
    };

    return (
        <div className="itinerary-manager">
            <h2>Manage Your Itineraries</h2>
            <ItineraryForm onSubmit={handleFormSubmit} />
            <ItineraryList itineraries={itineraries} />
        </div>
    );
};

export default ItineraryManager;
