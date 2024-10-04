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
  { field: 'PrevWork', headerName: 'PrevWork', width: 130 },
  { field: 'YearOfExp', headerName: 'Year Of Exp', width: 130 },
  { field: 'type', headerName: 'Type', width: 90 },
  { field: 'Status', headerName: 'Status', width: 110 },
];

export default function DataTable2() {
  const [rows, setRows] = useState([]);  // Remove typing annotations
  const [selectedRows, setSelectedRows] = useState([]);  // Remove typing annotations

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/getUsers?role=TourGuide');
        const formattedRows = response.data.map((user) => ({
          id: user._id,
          username: user.username,
          email: user.email,
          PrevWork: user.PrevWork,
          YearOfExp: user.YearOfExp,
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

  const handleUpdate = async () => {
    try {
      await Promise.all(
        selectedRows.map(rowId => 
          axios.put(`http://localhost:3000/admin/updateUserStatus/${rowId}`, { Status: "Accepted" })
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
