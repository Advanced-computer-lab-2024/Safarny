import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import styles from './TourGuide.module.css';

const EditItineraryForm = ({ itinerary, onClose, onSave, currencies }) => {
  const [editedItinerary, setEditedItinerary] = useState(itinerary);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedItinerary);
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className={styles.editModalHeader}>
        Edit Itinerary
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <div className="row g-3 mt-2">
            <div className="col-12">
              <TextField
                fullWidth
                label="Name"
                value={editedItinerary.name}
                onChange={(e) => setEditedItinerary({...editedItinerary, name: e.target.value})}
                required
              />
            </div>
            
            <div className="col-md-6">
              <TextField
                fullWidth
                label="Language"
                value={editedItinerary.language}
                onChange={(e) => setEditedItinerary({...editedItinerary, language: e.target.value})}
                required
              />
            </div>

            <div className="col-md-6">
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                value={editedItinerary.duration}
                onChange={(e) => setEditedItinerary({...editedItinerary, duration: e.target.value})}
                required
              />
            </div>

            <div className="col-md-6">
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={editedItinerary.price}
                onChange={(e) => setEditedItinerary({...editedItinerary, price: e.target.value})}
                required
              />
            </div>

            <div className="col-md-6">
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={editedItinerary.currency}
                  onChange={(e) => setEditedItinerary({...editedItinerary, currency: e.target.value})}
                  required
                >
                  {currencies.map((currency) => (
                    <MenuItem key={currency} value={currency}>
                      {currency}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="col-12">
              <TextField
                fullWidth
                label="Pickup Location"
                value={editedItinerary.pickupLocation}
                onChange={(e) => setEditedItinerary({...editedItinerary, pickupLocation: e.target.value})}
                required
              />
            </div>

            <div className="col-12">
              <TextField
                fullWidth
                label="Dropoff Location"
                value={editedItinerary.dropoffLocation}
                onChange={(e) => setEditedItinerary({...editedItinerary, dropoffLocation: e.target.value})}
                required
              />
            </div>

            <div className="col-12">
              <FormControl fullWidth>
                <InputLabel>Accessibility</InputLabel>
                <Select
                  value={editedItinerary.accessibility}
                  onChange={(e) => setEditedItinerary({...editedItinerary, accessibility: e.target.value})}
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </form>
      </DialogContent>
      <DialogActions className="p-3">
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditItineraryForm;