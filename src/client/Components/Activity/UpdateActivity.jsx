import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import styles from "./UpdateActivity.module.css";
import { useParams } from "react-router-dom";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
});

const UpdateActivity = () => {
  const { userId } = useParams();
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [message, setMessage] = useState("");

  const [activityDetails, setActivityDetails] = useState({
    date: "",
    time: "",
    location: "",
    coordinates: { lat: null, lng: null },
    price: "",
    category: "",
    tags: [],
    specialDiscount: "",
    bookingOpen: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const activityResponse = await axios.get(
          `/advertiser/activities/user/${userId}`
        );
        setActivities(activityResponse.data);

        const categoriesResponse = await axios.get(
          "/advertiser/GetCategories"
        );
        setCategories(categoriesResponse.data || []);

        const tagsResponse = await axios.get("/admin/tag");
        setTags(tagsResponse.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("Error loading data: " + error.message);
      }
    };

    fetchData();
  }, [userId]);

  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    const activity = activities.find((act) => act._id === selectedId);
    setSelectedActivity(activity);
    if (activity) {
      setActivityDetails({
        date: activity.date,
        time: activity.time,
        location: activity.location,
        coordinates: activity.coordinates,
        price: activity.price,
        category: activity.category || "",
        tags: activity.tags || [],
        specialDiscount: activity.specialDiscount,
        bookingOpen: activity.bookingOpen,
      });
    } else {
      setActivityDetails({
        date: "",
        time: "",
        location: "",
        coordinates: { lat: null, lng: null },
        price: "",
        category: "",
        tags: [],
        specialDiscount: "",
        bookingOpen: true,
      });
    }
  };

  const handleChange = (e) => {
    setActivityDetails({ ...activityDetails, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!selectedActivity) {
    setMessage("Please select an activity to update.");
    return;
  }

  const payload = {
    ...activityDetails,
    category: activityDetails.category,
    tags: activityDetails.tags,
  };

  try {
    const response = await axios.put(
      `/advertiser/${selectedActivity._id}`,
      payload
    );
    
    if (response.status === 200) {
      setMessage("Activity updated successfully!");

      if (activityDetails.bookingOpen) {
        try {
          const savedUsersResponse = await axios.get(
            `/tourist/getUsersBySavedActivity/${selectedActivity._id}`
          );
          const savedUsers = savedUsersResponse.data;

          if (savedUsers && savedUsers.length > 0) {
            const notificationPromises = savedUsers.map((user) =>
              axios.post('/notification/create', {
                title: `Activity "${selectedActivity.location}" is now open for booking`,
                message: `The activity "${selectedActivity.location}" on ${selectedActivity.date} at ${selectedActivity.time} is now open for booking.`,
                userId: user._id,
              })
            );

            await Promise.all(notificationPromises);
          }
        } catch (notificationError) {
          console.error("Error sending notifications:", notificationError);
        }
      }
    }
  } catch (error) {
    console.error("Error updating activity:", error);
    setMessage(
      "Error updating activity: " + 
      (error.response?.data?.message || error.message || "Unknown error occurred")
    );
  }
};
const LocationMap = () => {
    useMapEvents({
      click(e) {
        setActivityDetails({
          ...activityDetails,
          coordinates: { lat: e.latlng.lat, lng: e.latlng.lng },
        });
      },
    });
    return null;
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <main className={styles.mainContent}>
        <div className="container py-4">
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <h2>Update Activity</h2>
              <p>Modify your existing activity details</p>
            </div>

            <div className={styles.selectContainer}>
              <select
                className="form-select form-select-lg mb-4"
                onChange={handleSelectChange}
                value={selectedActivity ? selectedActivity._id : ""}
              >
                <option value="">Select an activity to update</option>
                {activities.map((activity) => (
                  <option key={activity._id} value={activity._id}>
                    {activity.location} - {activity.date} {activity.time}
                  </option>
                ))}
              </select>
            </div>

            {selectedActivity && (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className={styles.inputGroup}>
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="date"
                          name="date"
                          value={activityDetails.date}
                          onChange={handleChange}
                          required
                          onClick={(e) => (e.target.type = "date")}
                          onFocus={(e) => (e.target.type = "date")}
                          onBlur={(e) => {
                            if (!e.target.value) {
                              e.target.type = "text";
                            }
                          }}
                          placeholder="Select date"
                        />
                        <label htmlFor="date">Date</label>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className={styles.inputGroup}>
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="time"
                          name="time"
                          value={activityDetails.time}
                          onChange={handleChange}
                          required
                          onClick={(e) => (e.target.type = "time")}
                          onFocus={(e) => (e.target.type = "time")}
                          onBlur={(e) => {
                            if (!e.target.value) {
                              e.target.type = "text";
                            }
                          }}
                          placeholder="Select time"
                        />
                        <label htmlFor="time">Time</label>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className={styles.inputGroup}>
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="location"
                          name="location"
                          value={activityDetails.location}
                          onChange={handleChange}
                          placeholder="Enter location"
                          required
                        />
                        <label htmlFor="location">Location</label>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className={styles.inputGroup}>
                      <div className="form-floating">
                        <input
                          type="number"
                          className="form-control"
                          id="price"
                          name="price"
                          value={activityDetails.price}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="price">Price</label>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className={styles.inputGroup}>
                      <div className="form-floating">
                        <select
                          className="form-select"
                          id="category"
                          name="category"
                          value={activityDetails.category}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select category</option>
                          {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                        <label htmlFor="category">Category</label>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className={styles.inputGroup}>
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="specialDiscount"
                          name="specialDiscount"
                          value={activityDetails.specialDiscount}
                          onChange={handleChange}
                          placeholder="Enter special discount"
                        />
                        <label htmlFor="specialDiscount">Special Discount</label>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className={styles.switchContainer}>
                      <label className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="bookingOpen"
                          checked={activityDetails.bookingOpen}
                          onChange={(e) =>
                            setActivityDetails({
                              ...activityDetails,
                              bookingOpen: e.target.checked,
                            })
                          }
                        />
                        <span className="form-check-label">Booking Open</span>
                      </label>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className={styles.mapWrapper}>
                      <label className={styles.mapLabel}>
                        Update Location on Map
                      </label>
                      <div className={styles.mapContainer}>
                        <MapContainer
                          center={
                            activityDetails.coordinates.lat
                              ? [
                                  activityDetails.coordinates.lat,
                                  activityDetails.coordinates.lng,
                                ]
                              : [51.505, -0.09]
                          }
                          zoom={13}
                          style={{ height: "100%", width: "100%" }}
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <LocationMap />
                          {activityDetails.coordinates.lat && (
                            <Marker
                              position={[
                                activityDetails.coordinates.lat,
                                activityDetails.coordinates.lng,
                              ]}
                            />
                          )}
                        </MapContainer>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <button type="submit" className={styles.submitButton}>
                      Update Activity
                    </button>
                  </div>

                  {message && (
                    <div className="col-12">
                      <div
                        className={`alert ${
                          message.includes("success")
                            ? "alert-success"
                            : "alert-danger"
                        }`}
                      >
                        {message}
                      </div>
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UpdateActivity;
