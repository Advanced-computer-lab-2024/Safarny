import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ViewComplaints = () => {
    const location = useLocation();
    const [complaints, setComplaints] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const userId = location.state.userId;
                console.log('User ID:', userId); // Debugging line

                const complaintsResponse = await axios.get(`/tourist/complaints/${userId}`);
                console.log('Complaints Response:', complaintsResponse.data); // Debugging line

                setComplaints(complaintsResponse.data);
            } catch (err) {
                console.error('Error:', err); // Detailed error logging
                if (err.response && err.response.status === 404) {
                    setError('No complaints found for this submitter.');
                } else {
                    setError('Error fetching complaints. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchComplaints();
    }, [location.state]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>My Complaints</h2>
            {complaints.length === 0 ? (
                <p>No complaints found. You have not made any complaints yet.</p>
            ) : (
                <ul>
                    {complaints.map((complaint) => (
                        <li key={complaint._id}>
                            <h3>{complaint.title}</h3>
                            <p>{complaint.body}</p>
                            <p>Status: {complaint.status}</p>
                            <p>Date: {new Date(complaint.date).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ViewComplaints;