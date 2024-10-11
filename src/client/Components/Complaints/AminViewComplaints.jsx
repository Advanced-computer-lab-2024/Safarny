import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminViewComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [editingComplaint, setEditingComplaint] = useState(null);
    const [editDetails, setEditDetails] = useState({ title: '', body: '', status: 'pending' });
    const [editingComment, setEditingComment] = useState(null);
    const [editCommentText, setEditCommentText] = useState('');
    const [newCommentText, setNewCommentText] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [filterStatus, setFilterStatus] = useState('all');

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

    const handleEditClick = (complaint) => {
        setEditingComplaint(complaint._id);
        setEditDetails({ title: complaint.title, body: complaint.body, status: complaint.status });
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

    const handleEditCommentClick = (complaintId, commentIndex, commentText) => {
        setEditingComment({ complaintId, commentIndex });
        setEditCommentText(commentText);
    };

    const handleEditCommentChange = (e) => {
        setEditCommentText(e.target.value);
    };

    const handleEditCommentSubmit = async () => {
        const { complaintId, commentIndex } = editingComment;
        try {
            const updatedComments = [...complaints.find(c => c._id === complaintId).comments];
            updatedComments[commentIndex] = editCommentText;
            await axios.put(`/admin/complaints/${complaintId}`, { comments: updatedComments });
            setComplaints(complaints.map(complaint =>
                complaint._id === complaintId ? { ...complaint, comments: updatedComments } : complaint
            ));
            setEditingComment(null);
            setEditCommentText('');
        } catch (err) {
            console.error('Error:', err);
            setError('Error updating comment. Please try again.');
        }
    };

    const handleNewCommentChange = (e) => {
        setNewCommentText(e.target.value);
    };

    const handleNewCommentSubmit = async (complaintId) => {
        try {
            const updatedComments = [...complaints.find(c => c._id === complaintId).comments, newCommentText];
            await axios.put(`/admin/complaints/${complaintId}`, { comments: updatedComments });
            setComplaints(complaints.map(complaint =>
                complaint._id === complaintId ? { ...complaint, comments: updatedComments } : complaint
            ));
            setNewCommentText('');
        } catch (err) {
            console.error('Error:', err);
            setError('Error adding new comment. Please try again.');
        }
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const sortedComplaints = complaints.sort((a, b) => {
        if (sortOrder === 'asc') {
            return new Date(a.date) - new Date(b.date);
        } else {
            return new Date(b.date) - new Date(a.date);
        }
    });

    const filteredComplaints = sortedComplaints.filter(complaint => {
        if (filterStatus === 'all') {
            return true;
        }
        return complaint.status === filterStatus;
    });

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>All Complaints</h2>
            <div>
                <label>Sort by date: </label>
                <select value={sortOrder} onChange={handleSortChange}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
                <label>Filter by status: </label>
                <select value={filterStatus} onChange={handleFilterChange}>
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                </select>
            </div>
            {filteredComplaints.length === 0 ? (
                <p>No complaints found.</p>
            ) : (
                <ul>
                    {filteredComplaints.map((complaint) => (
                        <li key={complaint._id}>
                            {editingComplaint === complaint._id ? (
                                <div>
                                    <input
                                        type="text"
                                        name="title"
                                        value={editDetails.title}
                                        onChange={handleEditChange}
                                    />
                                    <textarea
                                        name="body"
                                        value={editDetails.body}
                                        onChange={handleEditChange}
                                    />
                                    <select
                                        name="status"
                                        value={editDetails.status}
                                        onChange={handleEditChange}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="resolved">Resolved</option>
                                    </select>
                                    <button onClick={() => handleEditSubmit(complaint._id)}>Save</button>
                                    <textarea
                                        placeholder="Add a new comment"
                                        value={newCommentText}
                                        onChange={handleNewCommentChange}
                                    />
                                    <button onClick={() => handleNewCommentSubmit(complaint._id)}>Add Comment</button>
                                </div>
                            ) : (
                                <div>
                                    <h3>{complaint.title}</h3>
                                    <p>{complaint.body}</p>
                                    <p>Status: {complaint.status}</p>
                                    <p>Date: {new Date(complaint.date).toLocaleString()}</p>
                                    <button onClick={() => handleEditClick(complaint)}>Edit</button>
                                    <div>
                                        <h4>Comments:</h4>
                                        {complaint.comments.length > 0 ? (
                                            complaint.comments.map((comment, index) => (
                                                <div key={index}>
                                                    {editingComment && editingComment.complaintId === complaint._id && editingComment.commentIndex === index ? (
                                                        <div>
                                                            <textarea
                                                                value={editCommentText}
                                                                onChange={handleEditCommentChange}
                                                            />
                                                            <button onClick={handleEditCommentSubmit}>Save</button>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <p>{comment}</p>
                                                            <button onClick={() => handleEditCommentClick(complaint._id, index, comment)}>Edit</button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p>No comments available.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdminViewComplaints;