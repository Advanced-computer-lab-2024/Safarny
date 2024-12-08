import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Footer from "/src/client/Components/Footer/Footer";
import Header from "/src/client/Components/Header/Header";
import styles from "./AdminViewComplaints.module.css";
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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

    return (
        <div className={styles.pageContainer} style={{ width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            
            <Container fluid className={`${styles.mainContent} flex-grow-1 py-4`}>
                <Card className={`${styles.contentCard} mb-4`}>
                    <Card.Body>
                        <h2 className={`${styles.heading} text-center mb-4`}>Complaints Management</h2>

                        <Row className="mb-4">
                            <Col md={6} className="mb-3 mb-md-0">
                                <Form.Group>
                                    <Form.Label>Sort by date</Form.Label>
                                    <Form.Select 
                                        value={sortOrder} 
                                        onChange={handleSortChange}
                                        className={styles.select}
                                    >
                                        <option value="asc">Ascending</option>
                                        <option value="desc">Descending</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Filter by status</Form.Label>
                                    <Form.Select 
                                        value={filterStatus} 
                                        onChange={handleFilterChange}
                                        className={styles.select}
                                    >
                                        <option value="all">All</option>
                                        <option value="pending">Pending</option>
                                        <option value="resolved">Resolved</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            </div>
                        ) : error ? (
                            <Alert variant="danger">{error}</Alert>
                        ) : filteredComplaints.length === 0 ? (
                            <Alert variant="info">No complaints found.</Alert>
                        ) : (
                            <div className={styles.complaintsContainer}>
                                <Row className="g-4">
                                    {filteredComplaints.map((complaint) => (
                                        <Col key={complaint._id} lg={4} md={6}>
                                            <Card className={styles.complaintItem}>
                                                <Card.Body>
                                                    <Card.Title className={styles.title}>{complaint.title}</Card.Title>
                                                    <Card.Text className={styles.body}>{complaint.body}</Card.Text>
                                                    <div className={`${styles.status} mb-2`}>
                                                        <span className={`badge ${complaint.status === 'resolved' ? 'bg-success' : 'bg-warning'}`}>
                                                            {complaint.status}
                                                        </span>
                                                    </div>
                                                    <div className={styles.date}>
                                                        {new Date(complaint.date).toLocaleString()}
                                                    </div>
                                                    
                                                    <div className={`${styles.commentsSection} mt-3`}>
                                                        <h6 style={{color: 'white'}}>Comments ({complaint.comments.length})</h6>
                                                        {complaint.comments.map((comment, index) => (
                                                            <div key={index} className={styles.comment}>
                                                                <p className="mb-1">{comment}</p>
                                                                <Button 
                                                                    variant="link" 
                                                                    size="sm"
                                                                    onClick={() => handleEditCommentClick(complaint._id, index, comment)}
                                                                >
                                                                    Edit
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    
                                                    <Button 
                                                        variant="primary" 
                                                        className={`${styles.editButton} w-100 mt-3`}
                                                        onClick={() => handleEditClick(complaint)}
                                                    >
                                                        Manage Complaint
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Container>

            <Modal
                isOpen={!!editingComplaint}
                onRequestClose={() => setEditingComplaint(null)}
                className={styles.modal}
                overlayClassName={styles.modalOverlay}
            >
                {editingComplaint && (
                    <div className={styles.modalContent}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="m-0">Edit Complaint</h4>
                            <Button 
                                variant="link" 
                                className={styles.closeButton}
                                onClick={() => setEditingComplaint(null)}
                            >
                                ×
                            </Button>
                        </div>

                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={editDetails.title}
                                    onChange={handleEditChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="body"
                                    value={editDetails.body}
                                    onChange={handleEditChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                    name="status"
                                    value={editDetails.status}
                                    onChange={handleEditChange}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="resolved">Resolved</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Add Comment</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    placeholder="Add a new comment"
                                    value={newCommentText}
                                    onChange={handleNewCommentChange}
                                />
                            </Form.Group>

                            <div className="d-flex gap-2 justify-content-end">
                                <Button 
                                    variant="secondary" 
                                    onClick={() => setEditingComplaint(null)}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    variant="success"
                                    onClick={() => handleNewCommentSubmit(editingComplaint)}
                                >
                                    Add Comment
                                </Button>
                                <Button 
                                    variant="primary"
                                    onClick={() => handleEditSubmit(editingComplaint)}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </Form>
                    </div>
                )}
            </Modal>

            <Footer />
        </div>
    );
};

export default AdminViewComplaints;