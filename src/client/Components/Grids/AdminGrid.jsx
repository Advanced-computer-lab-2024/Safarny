import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import axios from 'axios';
import { Modal } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

// Define the columns
const columns = [
  { field: 'id', headerName: 'ID', width: 250 },
  { field: 'username', headerName: 'Username', width: 130 },
  { field: 'email', headerName: 'Email', width: 180 },
  { field: 'type', headerName: 'Type', width: 90 },
  { field: 'password', headerName: 'Password', width: 130 },
];

export default function DataTable() {
  const [rows, setRows] = useState([]); // Remove type annotations
  const [selectedRows, setSelectedRows] = useState([]); // Remove type annotations
  const [modal,setModal]=useState(false);
  const [newPassword,setNewPassword]=useState('');

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
          axios.put(`http://localhost:3000/admin/UpdateProfileById`, {
            id: rowId,  // Send the id in the body
          password: newPassword,
          })
        )
      );
      setRows(rows.map(row => selectedRows.includes(row.id) ? { ...row, password: newPassword } : row));
      setSelectedRows([]); // Clear selection after update
      setModal(false);
    } catch (error) {
      console.error('Error updating users:', error);
    }
  };
  const handleOpen=async ()=>{
    setModal(true);
  }

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
