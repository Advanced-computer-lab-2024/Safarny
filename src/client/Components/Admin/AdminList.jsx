import React, { useState } from 'react';
import SideBar from '../SideBar/SideBar';
import DataTable2 from '../Grids/AdminGrid';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Button, Modal, TextField, Typography, Card, CardContent, CardActions, Alert } from '@mui/material';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './TourGuideAdmin.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const AdminList = () => {
    const [showAddAdminModal, setShowAddAdminModal] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');
    const type = "admin";

    const handleAddAdminClick = () => {
        setShowAddAdminModal(true);
    };

    const handleCloseModal = () => {
        setShowAddAdminModal(false);
        setSuccess(false);
        setEmail('');
        setPassword('');
        setUsername('');
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const userData = { email, password, username, type };

        try {
            const response = await axios.post('http://localhost:3000/admin/addAdmin', userData);
            if (response.status === 201) {
                setSuccess(true);
                setError('');
                console.log('Admin added');
                handleCloseModal();
                window.location.reload();
            }
        } catch (err) {
            console.log(err);
            setError('Registration failed. Please try again.');
            setSuccess(false);
        }
    };

    return (
        <div className={styles.pageContainer} style={{ width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            
            <div className={styles.contentWrapper}>
                <SideBar />
                
                <Container fluid className={styles.mainContent}>
                    <Row className="mb-4">
                        <Col>
                            <Card className={styles.headerCard}>
                                <CardContent>
                                    <h2 className={styles.pageTitle}>Admin Management</h2>
                                    <p className={styles.pageDescription}>
                                        Manage and oversee all administrator accounts
                                    </p>
                                    <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            onClick={handleAddAdminClick}
                                        >
                                            Add New Admin
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </Col>
                    </Row>

                    {error && (
                        <Row className="mb-3">
                            <Col>
                                <Alert severity="error">{error}</Alert>
                            </Col>
                        </Row>
                    )}

                    {success && (
                        <Row className="mb-3">
                            <Col>
                                <Alert severity="success">Admin added successfully!</Alert>
                            </Col>
                        </Row>
                    )}

                    <Row>
                        <Col>
                            <Card className={styles.contentCard}>
                                <CardContent>
                                    <div className={styles.tableWrapper}>
                                        <DataTable2 />
                                    </div>
                                </CardContent>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Modal
                open={showAddAdminModal}
                onClose={handleCloseModal}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Card style={{ 
                    width: '90%', 
                    maxWidth: '500px',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    padding: '2rem'
                }}>
                    <CardContent>
                        <Typography variant="h5" component="div" style={{ marginBottom: '1rem' }}>
                            Add New Admin
                        </Typography>
                        <form onSubmit={handleAdd}>
                            <TextField
                                fullWidth
                                label="Username"
                                variant="outlined"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                sx={{ marginBottom: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{ marginBottom: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{ marginBottom: 2 }}
                            />
                            <CardActions style={{ justifyContent: 'flex-end', padding: '0' }}>
                                <Button variant="outlined" onClick={handleCloseModal}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" color="primary">
                                    Add Admin
                                </Button>
                            </CardActions>
                        </form>
                    </CardContent>
                </Card>
            </Modal>

            <Footer />
        </div>
    );
};

export default AdminList;
