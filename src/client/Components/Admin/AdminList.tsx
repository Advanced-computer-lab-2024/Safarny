import React, { useState } from 'react';
import SideBar from '../../components/SideBar';
import DataTable2 from '../../components/Grids/AdminGrid';
import { Button, Modal, TextField, Typography, Card, CardContent, CardActions, Alert } from '@mui/material';
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
        setSuccess(false);  // Reset success state when closing modal
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const userData = { email, password, username, type };

        try {
            const response = await axios.post('http://localhost:3000/addadmin', userData);
            if (response.status === 201) {
                setSuccess(true);
                setError('');
                console.log('Admin added');
                handleCloseModal();
            }
        } catch (err) {
            console.log(err);
            setError('Registration failed. Please try again.');
            setSuccess(false);
        }
    };

    return (
        <div style={{ display: 'flex' }}>
          {error && <Alert severity="error">{error}</Alert>}
            <SideBar />
            <div style={{ marginLeft: '250px', padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2>Admin List</h2>
                <div style={{ position: 'relative', width: '100%', maxWidth: '800px' }}>
                    <Button variant="contained" color="success" onClick={handleAddAdminClick}>
                        Add Admin
                    </Button>
                    <DataTable2 />
                    {success && <Alert severity="success">Admin added successfully!</Alert>}
                </div>

                {/* Modal for adding admin */}
                <Modal
                    open={showAddAdminModal}
                    onClose={handleCloseModal}
                    aria-labelledby="add-admin-modal-title"
                    aria-describedby="add-admin-modal-description"
                >
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Card sx={{ maxWidth: 400 }}>
                            <CardContent>
                                <Typography variant="h5" component="div" id="add-admin-modal-title">
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
                                    <CardActions>
                                        <Button type="submit" variant="contained" color="primary">
                                            Add Admin
                                        </Button>
                                        <Button variant="outlined" onClick={handleCloseModal}>
                                            Cancel
                                        </Button>
                                    </CardActions>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default AdminList;
