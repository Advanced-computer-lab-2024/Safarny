import React from 'react';

const ItineraryItem = ({ itinerary, onDelete }) => {
    const handleDelete = async () => {
        await fetch(`/touristItinerary/${itinerary._id}`, {
            method: 'DELETE',
        });
        // Call the onDelete function to trigger a refresh of the itinerary list
        onDelete(itinerary._id);
    };

    return (
        <div>
            <h3>{itinerary.name}</h3>
            <button onClick={handleDelete}>Delete</button>
        </div>
    );
};

export default ItineraryItem;
