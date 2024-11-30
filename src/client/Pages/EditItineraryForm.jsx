import React, { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function EditItineraryForm({
  open,
  handleClose,
  itinerary,
  setItinerary,
  activities,
  tags,
}) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itinerary) {
      setMessage("Please select an itinerary to update.");
      return;
    }

    // Create a copy of the itinerary object without the rating field
    const { rating, ...payload } = itinerary;

    try {
      const response = await axios.patch(
        `http://localhost:3000/itineraries/${itinerary._id}`,
        payload
      );
      if (response.status === 200) {
        setMessage("Itinerary updated successfully!");

        // Check if the booking status is now active
        if (itinerary.bookingOpen === "active") {
          // Fetch the list of users who have saved this itinerary
          const savedUsersResponse = await axios.get(
            `http://localhost:3000/tourist/getUsersBySavedItinerary/${itinerary._id}`
          );
          const savedUsers = savedUsersResponse.data;

          // Send a notification to each user
          const notificationPromises = savedUsers.map((user) =>
            axios.post('/notification/create', {
              title: `Itinerary "${itinerary.name}" is now open for booking`,
              message: `The itinerary "${itinerary.name}" is now open for booking.`,
              userId: user._id,
            })
          );

          await Promise.all(notificationPromises);
          console.log("Notifications sent to users who saved the itinerary");

          // Send an email to each user
          const emailPromises = savedUsers.map((user) =>
            axios.post('/email/send-email', {
              to: user.email,
              subject: `Itinerary "${itinerary.name}" is now open for booking`,
              text: `The itinerary "${itinerary.name}" is now open for booking.`
            })
          );

          await Promise.all(emailPromises);
          console.log("Emails sent to users who saved the itinerary");
        }
      }
    } catch (error) {
      console.error("Error updating itinerary:", error);
      setMessage("Error updating itinerary: " + error.message);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Edit Itinerary</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {/* Itinerary Name */}
          <TextField
            fullWidth
            id="name"
            label="Itinerary Name"
            variant="outlined"
            value={itinerary?.name || ""}
            onChange={(e) =>
              setItinerary({
                ...itinerary,
                name: e.target.value,
              })
            }
            required
          />

          {/* Activities */}
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id="activities-label">Activities</InputLabel>
            <Select
              labelId="activities-label"
              id="activities"
              multiple
              value={itinerary?.activities || []}
              onChange={(e) =>
                setItinerary({
                  ...itinerary,
                  activities: e.target.value,
                })
              }
              label="Activities"
            >
              {activities.map((activity) => (
                <MenuItem key={activity._id} value={activity._id}>
                  {activity.location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Booking Open Selection */}
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id="booking-open-label">Booking Status</InputLabel>
            <Select
              labelId="booking-open-label"
              id="bookingOpen"
              value={itinerary.bookingOpen}
              onChange={(e) =>
                setItinerary({
                  ...itinerary,
                  bookingOpen: e.target.value,
                })
              }
              label="Booking Status"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="in-active">In-active</MenuItem>
            </Select>
          </FormControl>

          {/* Tags */}
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id="tags-label">Tags</InputLabel>
            <Select
              labelId="tags-label"
              id="tags"
              multiple
              value={itinerary?.tagNames || []}
              onChange={(e) =>
                setItinerary({
                  ...itinerary,
                  tagNames: e.target.value,
                })
              }
              label="Tags"
            >
              {tags.map((tag) => (
                <MenuItem key={tag._id} value={tag.name}>
                  {tag.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Additional fields similar to the above */}
          <TextField
            fullWidth
            id="locations"
            label="Locations"
            variant="outlined"
            value={itinerary?.locations || ""}
            onChange={(e) =>
              setItinerary({
                ...itinerary,
                locations: e.target.value,
              })
            }
            margin="normal"
          />

          <TextField
            fullWidth
            id="timeline"
            label="Timeline"
            variant="outlined"
            value={itinerary?.timeline || ""}
            onChange={(e) =>
              setItinerary({
                ...itinerary,
                timeline: e.target.value,
              })
            }
            margin="normal"
          />

          <TextField
            fullWidth
            id="duration"
            label="Duration (minutes)"
            variant="outlined"
            type="number"
            value={itinerary?.duration || 0}
            onChange={(e) =>
              setItinerary({
                ...itinerary,
                duration: e.target.value,
              })
            }
            margin="normal"
          />

          <TextField
            fullWidth
            id="language"
            label="Language"
            variant="outlined"
            value={itinerary?.language || ""}
            onChange={(e) =>
              setItinerary({
                ...itinerary,
                language: e.target.value,
              })
            }
            margin="normal"
          />

          <TextField
            fullWidth
            id="price"
            label="Price"
            variant="outlined"
            type="number"
            value={itinerary?.price || 0}
            onChange={(e) =>
              setItinerary({
                ...itinerary,
                price: e.target.value,
              })
            }
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Currency</InputLabel>
            <Select
              name="currency"
              value={itinerary.currency}
              onChange={(e) =>
                setItinerary({
                  ...itinerary,
                  currency: e.target.value,
                })
              }
            >
              <MenuItem value="EGP">EGP</MenuItem>
              <MenuItem value="SAR">SAR</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
              <MenuItem value="GBP">GBP</MenuItem>
            </Select>
          </FormControl>

          {/* Available Dates */}
          <TextField
            fullWidth
            id="availableDates"
            label="Available Dates"
            variant="outlined"
            value={itinerary?.availableDates || ""}
            onChange={(e) =>
              setItinerary({
                ...itinerary,
                availableDates: e.target.value,
              })
            }
            margin="normal"
          />

          {/* Available Times */}
          <TextField
            fullWidth
            id="availableTimes"
            label="Available Times"
            variant="outlined"
            value={itinerary?.availableTimes || ""}
            onChange={(e) =>
              setItinerary({
                ...itinerary,
                availableTimes: e.target.value,
              })
            }
            margin="normal"
          />

          {/* Accessibility */}
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id="accessibility-label">Accessibility</InputLabel>
            <Select
              labelId="accessibility-label"
              id="accessibility"
              value={itinerary?.accessibility || ""}
              onChange={(e) =>
                setItinerary({
                  ...itinerary,
                  accessibility: e.target.value,
                })
              }
              label="Accessibility"
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
          </FormControl>

          {/* Pickup Location */}
          <TextField
            fullWidth
            id="pickupLocation"
            label="Pickup Location"
            variant="outlined"
            value={itinerary?.pickupLocation || ""}
            onChange={(e) =>
              setItinerary({
                ...itinerary,
                pickupLocation: e.target.value,
              })
            }
            margin="normal"
          />

          {/* Dropoff Location */}
          <TextField
            fullWidth
            id="dropoffLocation"
            label="Dropoff Location"
            variant="outlined"
            value={itinerary?.dropoffLocation || ""}
            onChange={(e) =>
              setItinerary({
                ...itinerary,
                dropoffLocation: e.target.value,
              })
            }
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" color="primary" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}