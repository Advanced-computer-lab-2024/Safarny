import React from "react";
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
  handleSubmit,
}) {
  console.log("Tags:", tags);
  console.log("Selected Tags:", itinerary?.tagNames);
  console.log("Selected Activities:", itinerary?.activities);
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
            label="Price ($)"
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
