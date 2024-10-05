import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import axios from 'axios';

// Define the columns for the tourism data grid
const columns = [
  { field: 'id', headerName: 'ID', width: 250 },
  { field: 'touristName', headerName: 'Tourist Name', width: 150 },
  { field: 'email', headerName: 'Email', width: 150 },
  { field: 'destination', headerName: 'Destination', width: 150 },
  { field: 'tourGuide', headerName: 'Tour Guide', width: 150 },
  { field: 'packageType', headerName: 'Package Type', width: 130 },
  { field: 'Status', headerName: 'Status', width: 110 },
];

export default function TourismGrid() {
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/getTourists');
        const formattedRows = response.data.map((tourist) => ({
          id: tourist._id,
          touristName: tourist.touristName,
          email: tourist.email,
          destination: tourist.destination,
          tourGuide: tourist.tourGuide,
          packageType: tourist.packageType,
          Status: tourist.Status,
        }));
        setRows(formattedRows);
      } catch (error) {
        console.error('Error fetching tourists:', error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedRows.map(rowId =>
          axios.delete(`http://localhost:3000/admin/deleteTourist/${rowId}`)
        )
      );
      // Refetch data or update state to remove deleted rows
      setRows(rows.filter(row => !selectedRows.includes(row.id)));
      setSelectedRows([]); // Clear selection after deletion
    } catch (error) {
      console.error('Error deleting tourists:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await Promise.all(
        selectedRows.map(rowId => 
          axios.put(`http://localhost:3000/admin/updateTouristStatus/${rowId}`, { Status: "Confirmed" })
        )
      );
      // Optionally refetch data or update the state
      setRows(rows.map(row => selectedRows.includes(row.id) ? { ...row, Status: "Confirmed" } : row));
      setSelectedRows([]); // Clear selection after update
    } catch (error) {
      console.error('Error updating tourists:', error);
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
