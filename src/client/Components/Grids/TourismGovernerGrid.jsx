import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import axios from 'axios';

// Define the columns without TypeScript typing
const columns = [
    { field: 'id', headerName: 'ID', width: 350 },
    { field: 'username', headerName: 'Username', width: 200 },
    { field: 'type', headerName: 'Type', width: 250 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'password', headerName: 'Password', width: 250 },
];

export default function DataTable5() {
    const [rows, setRows] = useState([]);  // Remove typing annotations
    const [selectedRows, setSelectedRows] = useState([]);  // Remove typing annotations

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/admin/getUsers?role=TourismGovernor');
                const formattedRows = response.data.map((user) => ({
                    id: user._id,
                    username: user.username,
                    password: user.password,
                    email: user.email,
                    PrevWork: user.PrevWork,
                    YearOfExp: user.YearOfExp,
                    type: user.role,
                }));
                setRows(formattedRows);
            } catch (error) {
                console.error('Error fetching users:', error);
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
            // Refetch data or update state to remove deleted rows
            setRows(rows.filter(row => !selectedRows.includes(row.id)));
            setSelectedRows([]); // Clear selection after deletion
        } catch (error) {
            console.error('Error deleting users:', error);
        }
    };

    return (
        <Paper sx={{ height: 500, width: '100%' }}>
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
            />
            {selectedRows.length > 0 && (
                <div>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        sx={{ marginTop: 2 }}
                    >
                        Delete Selected
                    </Button>
                </div>
            )}
        </Paper>
    );
}
