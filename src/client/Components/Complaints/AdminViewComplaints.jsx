import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Footer from "/src/client/Components/Footer/Footer";
import Header from "/src/client/Components/Header/Header";
import styles from "./AdminViewComplaints.module.css";

Modal.setAppElement('#root');

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
        return <p className={styles.loading}>Loading...</p>;
    }

    if (error) {
        return <p className={styles.error}>{error}</p>;
    }

    return (
        <div className={styles.container}>
            <Header />
            <h2 className={styles.heading}>All Complaints</h2>
            <div className={styles.select}>
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
    <p className={styles.noComplaints}>No complaints found.</p>
) : (
    <div className={styles.complaintsContainer}>
        {filteredComplaints.map((complaint) => (
            <div key={complaint._id} className={styles.complaintItem}>
                <h3 className={styles.title}>{complaint.title}</h3>
                <p className={styles.body}>{complaint.body}</p>
                <p className={styles.status}>Status: {complaint.status}</p>
                <p className={styles.date}>Date: {new Date(complaint.date).toLocaleString()}</p>
                <button onClick={() => handleEditClick(complaint)} className={styles.editButton}>
                    Edit
                </button>
                <div className={styles.commentsSection}>
                    <h4>Comments:</h4>
                    {complaint.comments.length > 0 ? (
                        complaint.comments.map((comment, index) => (
                            <div key={index} className={styles.comment}>
                                {editingComment &&
                                editingComment.complaintId === complaint._id &&
                                editingComment.commentIndex === index ? (
                                    <div className={styles.editComment}>
                                        <textarea
                                            value={editCommentText}
                                            onChange={handleEditCommentChange}
                                            className={styles.commentEditInput}
                                        />
                                        <button
                                            onClick={handleEditCommentSubmit}
                                            className={styles.saveCommentButton}
                                        >
                                            Save
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.commentText}>
                                        <p>{comment}</p>
                                        <button
                                            onClick={() =>
                                                handleEditCommentClick(complaint._id, index, comment)
                                            }
                                            className={styles.editCommentButton}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No comments available.</p>
                    )}
                </div>
            </div>
        ))}
    </div>
)}
            <Footer />
            <Modal
                isOpen={!!editingComplaint}
                onRequestClose={() => setEditingComplaint(null)}
                contentLabel="Edit Complaint"
                style={{
                    content: {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'white',
                        padding: '20px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        width: '600px',
                        height: '370px',
                        overflowY: 'auto',
                        zIndex: 1000
                    },
                    overlay: {
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        zIndex: 999
                    }
                }}
            >
                {editingComplaint && (
                    <div>
                        <button
                            onClick={() => setEditingComplaint(null)}
                            className={styles.closeButton}
                        >
                            &times;
                        </button>
                        <h2>Edit Complaint</h2>
                        <input
                            type="text"
                            name="title"
                            value={editDetails.title}
                            onChange={handleEditChange}
                            style={{color: 'black'}}
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
                        <button onClick={() => handleEditSubmit(editingComplaint)}>
                            Save
                        </button>
                        <br/>
                        <br/>
                        <textarea
                            placeholder="Add a new comment"
                            value={newCommentText}
                            onChange={handleNewCommentChange}
                        />
                        <br/>
                        <button onClick={() => handleNewCommentSubmit(editingComplaint)}>
                            Add Comment
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminViewComplaints;