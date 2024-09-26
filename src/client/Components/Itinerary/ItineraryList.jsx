import React from 'react';
import ItineraryItem from './ItineraryItem';

const ItineraryList = ({ itineraries }) => {
    return (
        <div>
            {itineraries.length === 0 ? (
                <p>No itineraries found.</p>
            ) : (
                itineraries.map(itinerary => (
                    <ItineraryItem key={itinerary._id} itinerary={itinerary} />
                ))
            )}
        </div>
    );
};

export default ItineraryList;
