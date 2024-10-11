import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ViewComplaints = () => {
    const location = useLocation();
    const [complaints, setComplaints] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const userId = location.state.userId;
                console.log('User ID:', userId); // Debugging line

                const userResponse = await axios.get(`/tourist/${userId}`);
                console.log('User Response:', userResponse.data); // Debugging line

                const userRole = userResponse.data.role;
                setIsAdmin(userRole === 'admin');

                const complaintsResponse = userRole === 'admin'
                    ? await axios.get('/admin/complaints')
                    : await axios.get(`/tourist/complaints/${userId}`);
                console.log('Complaints Response:', complaintsResponse.data); // Debugging line

                setComplaints(complaintsResponse.data);
            } catch (err) {
                console.error('Error:', err); // Detailed error logging
                setError('Error fetching complaints. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserRole();
    }, [location.state]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>{isAdmin ? 'All Complaints' : 'My Complaints'}</h2>
            {complaints.length === 0 ? (
                <p>No complaints found.</p>
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