import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import axios from 'axios';
import { Modal, CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

// Define the columns
const columns = [
    { field: 'id', headerName: 'ID', width: 230 },
    { field: 'username', headerName: 'Username', width: 130 },
    { field: 'email', headerName: 'Email', width: 180 },
    { field: 'type', headerName: 'Type', width: 90 },
    { field: 'password', headerName: 'Password', width: 120 },
];

export default function DataTable() {
    const [rows, setRows] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [modal, setModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/admin/getUsers?role=Admin');
                const formattedRows = response.data.map((user) => ({
                    id: user._id,
                    username: user.username,
                    password: user.password,
                    email: user.email,
                    nationality: user.nationality,
                    mobile: user.mobile,
                    employed: user.employed,
                    type: user.role,
                }));
                setRows(formattedRows);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false); // Set loading to false after data is fetched
            }
        };

        fetchData();
    }, []);

    const handleDelete = async () => {
        try {
            await Promise.all(
                selectedRows.map(rowId =>
                    axios.delete(`http://localhost:3000/admin/deleteUser/${rowId}`)
                )
            );
            setRows(rows.filter(row => !selectedRows.includes(row.id)));
            setSelectedRows([]);
        } catch (error) {
            console.error('Error deleting users:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            await Promise.all(
                selectedRows.map(rowId =>
                    axios.put(`http://localhost:3000/admin/UpdateProfileById`, {
                        id: rowId,
                        password: newPassword,
                    })
                )
            );
            setRows(rows.map(row => selectedRows.includes(row.id) ? { ...row, password: newPassword } : row));
            setSelectedRows([]);
            setModal(false);
        } catch (error) {
            console.error('Error updating users:', error);
        }
    };

    const handleOpen = async () => {
        setModal(true);
    };

    return (
        <Paper sx={{ height: 575, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(row) => row.id}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                onRowSelectionModelChange={(newSelection) => {
                    setSelectedRows(newSelection);
                }}
                sx={{ border: 0 }}
                loading={loading} // Use loading prop
                components={{
                    NoRowsOverlay: () => (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <CircularProgress />
                        </div>
                    ),
                }}
            />
            {selectedRows.length > 0 && (
                <div>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        sx={{ marginTop: 2, marginRight: 1 }}
                    >
                        Delete Selected
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpen}
                        sx={{ marginTop: 2 }}
                    >
                        Update Selected
                    </Button>
                </div>
            )}

            <Modal
                open={modal}
                onClose={() => setModal(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <h2 id="modal-title">Update Password</h2>
                    <TextField
                        label="New Password"
                        variant="outlined"
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpdate}
                        disabled={!newPassword} // Disable if no password is entered
                    >
                        Confirm Update
                    </Button>
                </Box>
            </Modal>
        </Paper>
    );
}