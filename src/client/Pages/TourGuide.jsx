import { useState, useEffect } from "react";
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
} from "@mui/material";
import axios from "axios";

export default function TourGuide() {
  const [itineraries, setItineraries] = useState([]);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });
  const [tabValue, setTabValue] = useState(0);
  const [newItinerary, setNewItinerary] = useState({
    name: "",
    activities: "",
    locations: "",
    timeline: "",
    duration: "",
    language: "",
    price: "",
    availableDates: "",
    availableTimes: "",
    accessibility: "",
    pickupLocation: "",
    dropoffLocation: "",
    tagNames: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const testId = "67009db9442511d0a050c42b";
        const profileResponse = await axios.get(
          `http://localhost:3000/tourguide/get-my-tourguide-details?id=${testId}`
        );
        setProfile(profileResponse.data);

        const itinerariesResponse = await axios.get(
          "http://localhost:3000/tourguide/get-itineraries"
        );
        setItineraries(itinerariesResponse.data.data);

        console.log(profile);
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
        newItinerary
      );
      setItineraries([...itineraries, response.data]);
      setNewItinerary({
        name: "",
        activities: "",
        locations: "",
        timeline: "",
        duration: "",
        language: "",
        price: "",
        availableDates: "",
        availableTimes: "",
        accessibility: "",
        pickupLocation: "",
        dropoffLocation: "",
        tagNames: "",
      });
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
            {Array.isArray(itineraries) &&
              itineraries.map((itinerary) => (
                <Box
                  key={itinerary.id}
                  mb={2}
                  p={2}
                  border={1}
                  borderRadius={1}
                >
                  <Typography variant="h6">{itinerary.name}</Typography>
                  <Typography variant="h9">{itinerary.language}</Typography>
                  <Box mt={2}>
                    <Button variant="outlined" color="primary" className="mr-2">
                      Edit
                    </Button>
                    <Button variant="contained" color="error">
                      Delete
                    </Button>
                  </Box>
                </Box>
              ))}
          </CardContent>
          <CardActions>
            <form onSubmit={handleCreateItinerary} style={{ width: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Create New Itinerary
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
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
                <TextField
                  fullWidth
                  id="activities"
                  label="Activities"
                  variant="outlined"
                  value={newItinerary.activities}
                  onChange={(e) =>
                    setNewItinerary({
                      ...newItinerary,
                      activities: e.target.value,
                    })
                  }
                />
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
                <TextField
                  fullWidth
                  id="duration"
                  label="Duration"
                  variant="outlined"
                  value={newItinerary.duration}
                  onChange={(e) =>
                    setNewItinerary({
                      ...newItinerary,
                      duration: e.target.value,
                    })
                  }
                />
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
                <TextField
                  fullWidth
                  id="price"
                  label="Price"
                  variant="outlined"
                  value={newItinerary.price}
                  onChange={(e) =>
                    setNewItinerary({ ...newItinerary, price: e.target.value })
                  }
                />
                <TextField
                  fullWidth
                  id="availableDates"
                  label="Available Dates"
                  variant="outlined"
                  value={newItinerary.availableDates}
                  onChange={(e) =>
                    setNewItinerary({
                      ...newItinerary,
                      availableDates: e.target.value,
                    })
                  }
                />
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
                <TextField
                  fullWidth
                  id="accessibility"
                  label="Accessibility"
                  variant="outlined"
                  value={newItinerary.accessibility}
                  onChange={(e) =>
                    setNewItinerary({
                      ...newItinerary,
                      accessibility: e.target.value,
                    })
                  }
                />
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
                <TextField
                  fullWidth
                  id="tagNames"
                  label="Tag Names (comma separated)"
                  variant="outlined"
                  value={newItinerary.tagNames}
                  onChange={(e) =>
                    setNewItinerary({
                      ...newItinerary,
                      tagNames: e.target.value,
                    })
                  }
                />
                <Button variant="contained" color="primary" type="submit">
                  Create
                </Button>
              </Box>
            </form>
          </CardActions>
        </Card>
      )}
      {tabValue === 1 && (
        <Card>
          <CardHeader
            title="Your Profile"
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
      )}
    </div>
  );
}
