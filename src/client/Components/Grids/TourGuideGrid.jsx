import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import axios from 'axios';

// Define the columns without TypeScript typing
const columns = [
  { field: 'id', headerName: 'ID', width: 250 },
  { field: 'username', headerName: 'Username', width: 130 },
  { field: 'email', headerName: 'Email', width: 150 },
  { field: 'nationality', headerName: 'Nationality', width: 130 },
  { field: 'mobile', headerName: 'Mobile', width: 130 },
  { field: 'employed', headerName: 'Employed', width: 90 },
  { field: 'type', headerName: 'Type', width: 90 },
  { field: 'Status', headerName: 'Status', width: 90 },
];

export default function DataTable() {
  const [rows, setRows] = useState([]);  // Remove typing annotations
  const [selectedRows, setSelectedRows] = useState([]);  // Remove typing annotations

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users/?role=Tour Guide');
        const formattedRows = response.data.map((user) => ({
          id: user._id,
          username: user.username,
          email: user.email,
          nationality: user.nationality,
          mobile: user.mobile,
          employed: user.employed,
          type: user.role,
          Status: user.Status,
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
          axios.delete(`http://localhost:3000/users/${rowId}`)
        )
      );
      // Refetch data or update state to remove deleted rows
      setRows(rows.filter(row => !selectedRows.includes(row.id)));
      setSelectedRows([]); // Clear selection after deletion
    } catch (error) {
      console.error('Error deleting users:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await Promise.all(
        selectedRows.map(rowId => 
          axios.put(`http://localhost:3000/users/Status/${rowId}`, { Status: "Accepted" })
        )
      );
      // Optionally refetch data or update the state
      setRows(rows.map(row => selectedRows.includes(row.id) ? { ...row, Status: "Accepted" } : row));
      setSelectedRows([]); // Clear selection after update
    } catch (error) {
      console.error('Error updating users:', error);
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
        <Button
        variant="contained"
        color="success"
        onClick={handleUpdate}
        sx={{ marginTop: 2 }}
      >
        Update Selected
      </Button>
      </div>
      )}
    </Paper>
  );
}
