import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Card, CardContent, CardActions, Typography } from '@mui/material';

const AdminEditComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState('');
    const [editingComplaint, setEditingComplaint] = useState(null);
    const [editDetails, setEditDetails] = useState({ title: '', body: '' });

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await axios.get('/admin/complaints');
                setComplaints(response.data);
            } catch (err) {
                console.error('Error:', err);
                setError('Error fetching complaints. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchComplaints();
    }, []);

    const handleStatusChange = async (complaintId, status) => {
        try {
            await axios.put(`/admin/complaints/${complaintId}`, { status });
            setComplaints(complaints.map(complaint =>
                complaint._id === complaintId ? { ...complaint, status } : complaint
            ));
        } catch (err) {
            console.error('Error:', err);
            setError('Error updating complaint status. Please try again.');
        }
    };

    const handleReplyChange = (e) => {
        setReply(e.target.value);
    };

    const handleReplySubmit = async (complaintId) => {
        try {
            await axios.post(`/admin/complaints/${complaintId}/reply`, { reply });
            setComplaints(complaints.map(complaint =>
                complaint._id === complaintId ? { ...complaint, comments: [...complaint.comments, reply] } : complaint
            ));
            setReply('');
        } catch (err) {
            console.error('Error:', err);
            setError('Error replying to complaint. Please try again.');
        }
    };

    const handleEditClick = (complaint) => {
        setEditingComplaint(complaint._id);
        setEditDetails({ title: complaint.title, body: complaint.body });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditDetails({ ...editDetails, [name]: value });
    };

    const handleEditSubmit = async (complaintId) => {
        try {
            const updatedComplaint = {
                ...editDetails,
                comments: complaints.find(c => c._id === complaintId).comments
            };
            await axios.put(`/admin/complaints/${complaintId}`, updatedComplaint);
            setComplaints(complaints.map(complaint =>
                complaint._id === complaintId ? { ...complaint, ...updatedComplaint } : complaint
            ));
            setEditingComplaint(null);
        } catch (err) {
            console.error('Error:', err);
            setError('Error updating complaint. Please try again.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Edit Complaints</h2>
            {complaints.length === 0 ? (
                <p>No complaints found.</p>
            ) : (
                <ul>
                    {complaints.map((complaint) => (
                        <Card key={complaint._id} sx={{ maxWidth: 345, margin: '10px', backgroundColor: 'white' }}>
                            <CardContent>
                                {editingComplaint === complaint._id ? (
                                    <div>
                                        <TextField
                                            label="Title"
                                            name="title"
                                            value={editDetails.title}
                                            onChange={handleEditChange}
                                            fullWidth
                                            margin="normal"
                                        />
                                        <TextField
                                            label="Body"
                                            name="body"
                                            value={editDetails.body}
                                            onChange={handleEditChange}
                                            fullWidth
                                            margin="normal"
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleEditSubmit(complaint._id)}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                ) : (
                                    <div>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {complaint.title}
                                        </Typography>
                                        <p>{complaint.body}</p>
                                        <p>Status: {complaint.status}</p>
                                        <p>Date: {new Date(complaint.date).toLocaleString()}</p>
                                        <div>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleStatusChange(complaint._id, 'pending')}
                                            >
                                                Mark as Pending
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => handleStatusChange(complaint._id, 'resolved')}
                                            >
                                                Mark as Resolved
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="default"
                                                onClick={() => handleEditClick(complaint)}
                                            >
                                                Edit
                                            </Button>
                                        </div>
                                        <div>
                                            <TextField
                                                label="Reply"
                                                variant="outlined"
                                                fullWidth
                                                margin="normal"
                                                value={reply}
                                                onChange={handleReplyChange}
                                            />
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleReplySubmit(complaint._id)}
                                            >
                                                Submit Reply
                                            </Button>
                                        </div>
                                        <div>
                                            <h4>Comments:</h4>
                                            {complaint.comments.map((comment, index) => (
                                                <p key={index}>{comment}</p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdminEditComplaints;