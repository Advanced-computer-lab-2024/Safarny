import React, { useEffect, useState } from 'react';

const Sales = () => {
    const [totalRev, setTotalRev] = useState(0);
    const [activityRev, setActivityRev] = useState(0);
    const [itineraryRev, setItineraryRev] = useState(0);

    useEffect(() => {
        const fetchTotalRevenue = async () => {
            try {
                const response = await fetch('http://localhost:3000/admin/getAllRevenue');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTotalRev(data.totalRevenue); // Assuming totalRevenue is a key in the response
            } catch (error) {
                console.error("Error fetching total revenue:", error);
            }
        };

        const fetchActivityRevenue = async () => {
            try {
                const response = await fetch('http://localhost:3000/admin/getActivitiesRevenue');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setActivityRev(data.totalRevenue); // Assuming activityRevenue is a key in the response
            } catch (error) {
                console.error("Error fetching activity revenue:", error);
            }
        };

        const fetchItineraryRevenue = async () => {
            try {
                const response = await fetch('http://localhost:3000/admin/getItinerarayRevenue');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setItineraryRev(data.totalRevenue); // Assuming itineraryRevenue is a key in the response
            } catch (error) {
                console.error("Error fetching itinerary revenue:", error);
            }
        };

        fetchTotalRevenue();
        fetchActivityRevenue();
        fetchItineraryRevenue();
    }, []); // Added dependency array to prevent infinite fetch calls

    return (
        <div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Total Merchandise Revenue</h5>
                            <p className="card-text">{totalRev}</p>
                        </div>
                    </div>
                </div>

                <div className="col-sm-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Activity Revenue</h5>
                            <p className="card-text">{activityRev}</p>
                        </div>
                    </div>
                </div>

                <div className="col-sm-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Itinerary Revenue</h5>
                            <p className="card-text">{itineraryRev}</p>
                        </div>
                    </div>
                </div>

                <div className="col-sm-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Total System Revenue</h5>
                            <p className="card-text">{itineraryRev+activityRev+totalRev}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sales;
