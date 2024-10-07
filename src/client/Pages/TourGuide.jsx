import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Tabs,
  Tab,
  Box,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import EditItineraryForm from "./EditItineraryForm"; 
import Footer from '../Components/Footer/Footer';

export default function TourGuide() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state;
  const [itineraries, setItineraries] = useState([]);
  const [activities, setActivities] = useState([]);
  const [tags, setTags] = useState([]);
  const [profile, setProfile] = useState({
    PrevWork: "",
    YearOfExp: 0,
  });
  const [tabValue, setTabValue] = useState(0);
  const [newItinerary, setNewItinerary] = useState({
    name: "",
    activities: [],
    locations: [],
    timeline: [],
    duration: 0,
    language: "",
    price: 0,
    availableDates: [],
    availableTimes: [],
    accessibility: false,
    pickupLocation: "",
    dropoffLocation: "",
    tagNames: [],
  });
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const userId = "670155dc63c71fd000903246";
        const profileResponse = await axios.get(
          `http://localhost:3000/tourguide/get-my-tourguide-details?id=${userId}`
        );
        setProfile(profileResponse.data);

        const itinerariesResponse = await axios.get(
          `http://localhost:3000/tourguide/get-my-tourguide-itineraries/${userId}`
        );
        setItineraries(itinerariesResponse.data);
        console.log("itineraries: ", itinerariesResponse.data);

        // Fetch activities and tags
        const activitiesResponse = await axios.get(
          "http://localhost:3000/tourguide/get-activities"
        );
        setActivities(activitiesResponse.data); // Assuming it's an array of activities
        const tagsResponse = await axios.get(
          "http://localhost:3000/tourguide/get-tags"
        );
        setTags(tagsResponse.data); // Assuming it's an array of tags
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const handleCreateItinerary = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/tourguide/create-itineraries",
        { ...newItinerary, createdby: userId }
      );
      setItineraries([...itineraries, response.data]);
    } catch (error) {
      console.error("Error creating itinerary", error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/tourguide/edit-my-tourguide-profile/${profile.id}`,
        profile
      );
      setProfile(response.data);
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle edit button click
  const handleEditClick = async (itineraryId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/tourguide/get-itineraries/${itineraryId}`
      );
      setSelectedItinerary(response.data);
      setEditModalOpen(true); // Open the edit modal
    } catch (error) {
      console.error("Error fetching itinerary", error);
    }
  };

  // Handle delete button click
  const handleDeleteClick = async (itineraryId) => {
    try {
      await axios.delete(
        `http://localhost:3000/tourguide/delete-itineraries/${itineraryId}`
      );
    } catch (error) {
      console.error("Error deleting itinerary", error);
    }
  };

  // Handle update itinerary
  const handleUpdateItinerary = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/tourguide/edit-itineraries/${selectedItinerary._id}`,
        selectedItinerary
      );
      const updatedItineraries = itineraries.map((itinerary) =>
        itinerary._id === selectedItinerary._id ? response.data : itinerary
      );
      setItineraries(updatedItineraries);
      setEditModalOpen(false); // Close the modal after saving
    } catch (error) {
      console.error("Error updating itinerary", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Typography variant="h4" component="h1" gutterBottom>
        Tour Guide Dashboard
      </Typography>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="Tour Guide Tabs"
      >
        <Tab label="Itineraries" />
        <Tab label="Profile" />
      </Tabs>
      {tabValue === 0 && (
        <Card>
          <CardHeader
            title="Your Itineraries"
            subheader="Manage your tour itineraries here."
          />
          <CardContent>
            {itineraries.map((itinerary) => (
              <Box key={itinerary._id} mb={2} p={2} border={1} borderRadius={1}>
                <Typography variant="h6">Name: {itinerary.name}</Typography>
                <Typography variant="h6">
                  Language: {itinerary.language}
                </Typography>
                <Typography variant="h6">
                  Duration: {itinerary.duration} minutes
                </Typography>
                <Typography variant="h6">Price: ${itinerary.price}</Typography>
                <Typography variant="h6">
                  Accessibility: {itinerary.accessibility ? "Yes" : "No"}
                </Typography>
                <Typography variant="h6">
                  Pickup Location: {itinerary.pickupLocation}
                </Typography>
                <Typography variant="h6">
                  Dropoff Location: {itinerary.dropoffLocation}
                </Typography>
                <Typography variant="h6">
                  Activities:{" "}
                  {itinerary.activities &&
                    itinerary.activities
                      .map((activity) => activity.location)
                      .join(", ")}
                </Typography>
                <Typography variant="h6">
                  Tags:{" "}
                  {itinerary.tags &&
                    itinerary.tags.map((tag) => tag.name).join(", ")}
                </Typography>
                <Typography variant="h6">
                  Locations: {itinerary.locations}
                </Typography>
                <Typography variant="h6">
                  Timeline: {itinerary.timeline}
                </Typography>
                <Typography variant="h6">
                  Available Dates: {itinerary.availableDates}
                </Typography>
                <Typography variant="h6">
                  Available Times: {itinerary.availableTimes}
                </Typography>
                <Box mt={2}>
                  <Button
                    variant="outlined"
                    color="primary"
                    className="mr-2"
                    onClick={() => handleEditClick(itinerary._id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteClick(itinerary._id)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            ))}
          </CardContent>
          {selectedItinerary && (
            <EditItineraryForm
              open={isEditModalOpen}
              handleClose={() => setEditModalOpen(false)}
              itinerary={selectedItinerary}
              setItinerary={setSelectedItinerary}
              activities={activities}
              tags={tags}
              handleSubmit={handleUpdateItinerary}
            />
          )}
          <CardActions>
            <form onSubmit={handleCreateItinerary} style={{ width: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Create New Itinerary
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                {/* Itinerary Name */}
                <Tooltip title="Enter the name of the itinerary" arrow>
                  <TextField
                    fullWidth
                    id="name"
                    label="Itinerary Name"
                    variant="outlined"
                    value={newItinerary.name}
                    onChange={(e) =>
                      setNewItinerary({ ...newItinerary, name: e.target.value })
                    }
                  />
                </Tooltip>

                {/* Activities Select */}
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="activities-label">Activities</InputLabel>
                  <Select
                    labelId="activities-label"
                    id="activities"
                    multiple
                    value={newItinerary.activities}
                    onChange={(e) =>
                      setNewItinerary({
                        ...newItinerary,
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

                {/* Tags Select */}
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="tags-label">Tags</InputLabel>
                  <Select
                    labelId="tags-label"
                    id="tags"
                    multiple
                    value={newItinerary.tagNames}
                    onChange={(e) =>
                      setNewItinerary({
                        ...newItinerary,
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

                {/* Locations (Array of Strings) */}
                <Tooltip
                  title="Enter locations for the tour. You can separate multiple locations with commas."
                  arrow
                >
                  <TextField
                    fullWidth
                    id="locations"
                    label="Locations"
                    variant="outlined"
                    value={newItinerary.locations}
                    onChange={(e) =>
                      setNewItinerary({
                        ...newItinerary,
                        locations: e.target.value,
                      })
                    }
                  />
                </Tooltip>

                {/* Timeline (Array of Strings) */}
                <Tooltip
                  title="Enter the timeline of activities. You can separate multiple timelines with commas."
                  arrow
                >
                  <TextField
                    fullWidth
                    id="timeline"
                    label="Timeline"
                    variant="outlined"
                    value={newItinerary.timeline}
                    onChange={(e) =>
                      setNewItinerary({
                        ...newItinerary,
                        timeline: e.target.value,
                      })
                    }
                  />
                </Tooltip>

                {/* Duration (Number) */}
                <Tooltip
                  title="Enter the duration in minutes for each activity"
                  arrow
                >
                  <TextField
                    fullWidth
                    id="duration"
                    label="Duration (minutes)"
                    variant="outlined"
                    type="number"
                    value={newItinerary.duration}
                    onChange={(e) =>
                      setNewItinerary({
                        ...newItinerary,
                        duration: e.target.value,
                      })
                    }
                  />
                </Tooltip>

                {/* Language (String) */}
                <Tooltip title="Enter the language for the tour" arrow>
                  <TextField
                    fullWidth
                    id="language"
                    label="Language"
                    variant="outlined"
                    value={newItinerary.language}
                    onChange={(e) =>
                      setNewItinerary({
                        ...newItinerary,
                        language: e.target.value,
                      })
                    }
                  />
                </Tooltip>

                {/* Price (Number) */}
                <Tooltip title="Enter the price for the tour" arrow>
                  <TextField
                    fullWidth
                    id="price"
                    label="Price ($)"
                    variant="outlined"
                    type="number"
                    value={newItinerary.price}
                    onChange={(e) =>
                      setNewItinerary({
                        ...newItinerary,
                        price: e.target.value,
                      })
                    }
                  />
                </Tooltip>

                {/* Available Dates (Array of Dates) */}
                <Tooltip
                  title="Enter the available dates for the tour. You can select multiple dates."
                  arrow
                >
                  <TextField
                    fullWidth
                    id="availableDates"
                    label="Available Dates"
                    variant="outlined"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={newItinerary.availableDates}
                    onChange={(e) =>
                      setNewItinerary({
                        ...newItinerary,
                        availableDates: e.target.value,
                      })
                    }
                  />
                </Tooltip>

                {/* Available Times (Array of Strings) */}
                <Tooltip
                  title="Enter the available times for the tour. You can separate multiple times with commas."
                  arrow
                >
                  <TextField
                    fullWidth
                    id="availableTimes"
                    label="Available Times"
                    variant="outlined"
                    value={newItinerary.availableTimes}
                    onChange={(e) =>
                      setNewItinerary({
                        ...newItinerary,
                        availableTimes: e.target.value,
                      })
                    }
                  />
                </Tooltip>

                {/* Accessibility (Boolean) */}
                <Tooltip
                  title="Is the tour accessible? Select yes or no."
                  arrow
                >
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="accessibility-label">
                      Accessibility
                    </InputLabel>
                    <Select
                      labelId="accessibility-label"
                      id="accessibility"
                      value={newItinerary.accessibility}
                      onChange={(e) =>
                        setNewItinerary({
                          ...newItinerary,
                          accessibility: e.target.value,
                        })
                      }
                      label="Accessibility"
                    >
                      <MenuItem value={true}>Yes</MenuItem>
                      <MenuItem value={false}>No</MenuItem>
                    </Select>
                  </FormControl>
                </Tooltip>

                {/* Pickup Location */}
                <Tooltip
                  title="Enter the pickup location (e.g., a link or an address)"
                  arrow
                >
                  <TextField
                    fullWidth
                    id="pickupLocation"
                    label="Pickup Location"
                    variant="outlined"
                    value={newItinerary.pickupLocation}
                    onChange={(e) =>
                      setNewItinerary({
                        ...newItinerary,
                        pickupLocation: e.target.value,
                      })
                    }
                  />
                </Tooltip>

                {/* Dropoff Location */}
                <Tooltip
                  title="Enter the dropoff location (e.g., a link or an address)"
                  arrow
                >
                  <TextField
                    fullWidth
                    id="dropoffLocation"
                    label="Dropoff Location"
                    variant="outlined"
                    value={newItinerary.dropoffLocation}
                    onChange={(e) =>
                      setNewItinerary({
                        ...newItinerary,
                        dropoffLocation: e.target.value,
                      })
                    }
                  />
                </Tooltip>

                {/* Submit Button */}
                <Button variant="contained" color="primary" type="submit">
                  Create
                </Button>
              </Box>
            </form>
          </CardActions>
        </Card>
      )}
      {/* {tabValue === 1 && (
        <Card>
          <CardHeader
            title={`Your Profile - ${profile.username}`}
            subheader="Update your tour guide profile here."
          />
          <CardContent>
            <form onSubmit={handleUpdateProfile}>
              <Box mb={2}>
                <TextField
                  fullWidth
                  id="PrevWork"
                  label="PrevWork"
                  variant="outlined"
                  value={profile.PrevWork}
                  onChange={(e) =>
                    setProfile({ ...profile, PrevWork: e.target.value })
                  }
                />
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  id="YearOfExp"
                  label="YearOfExp"
                  variant="outlined"
                  value={profile.YearOfExp}
                  onChange={(e) =>
                    setProfile({ ...profile, YearOfExp: e.target.value })
                  }
                />
              </Box>
              <Button variant="contained" color="primary" type="submit">
                Update Profile
              </Button>
            </form>
          </CardContent>
        </Card>
      )} */}
      <Footer />
    </div>
  );
}
