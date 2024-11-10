import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Header from "/src/client/Components/Header/Header";
import Footer from "/src/client/Components/Footer/Footer";
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
          "http://localhost:3000/advertiser/GetCategories"
        );
        setCategories(categoriesResponse.data || []);

        const tagsResponse = await axios.get("http://localhost:3000/admin/tag");
        setTags(tagsResponse.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
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
        `http://localhost:3000/advertiser/${selectedActivity._id}`,
        payload
      );
      if (response.status === 200) {
        setMessage("Activity updated successfully!");
      }
    } catch (error) {
      console.error("Error updating activity:", error);
      setMessage("Error updating activity: " + error.message);
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
    <div className={styles.container}>
      <Header />
      <h2 className={styles.header}>Update Activity</h2>
      <div>
        <label className={styles.selectActivity}>
          Select Activity:
          <select
            onChange={handleSelectChange}
            value={selectedActivity ? selectedActivity._id : ""}
          >
            <option value="">Select an activity</option>
            {activities.map((activity) => (
              <option key={activity._id} value={activity._id}>
                {activity.location} - {activity.date} {activity.time}
              </option>
            ))}
          </select>
        </label>
      </div>

      {selectedActivity && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label>
              Date:
              <input
                name="date"
                type="date"
                value={activityDetails.date}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Time:
              <input
                name="time"
                type="time"
                value={activityDetails.time}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Location:
              <input
                name="location"
                type="text"
                value={activityDetails.location}
                onChange={handleChange}
                placeholder="Enter new location name"
              />
            </label>
          </div>
          <div>
            <label>
              Price:
              <input
                name="price"
                type="number"
                value={activityDetails.price}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Category:
              <select
                name="category"
                value={activityDetails.category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <label>
              Tags:
              <select
                multiple
                name="tags"
                value={activityDetails.tags}
                onChange={handleChange}
              >
                {tags.map((tag) => (
                  <option key={tag._id} value={tag._id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <label>
              Special Discount:
              <input
                name="specialDiscount"
                type="text"
                value={activityDetails.specialDiscount}
                onChange={handleChange}
                placeholder="Enter discount description"
              />
            </label>
          </div>
          <div>
            <label>
              Booking Open:
              <input
                name="bookingOpen"
                type="checkbox"
                checked={activityDetails.bookingOpen}
                onChange={(e) =>
                  setActivityDetails({
                    ...activityDetails,
                    bookingOpen: e.target.checked,
                  })
                }
              />
            </label>
          </div>

          <div className={styles.mapContainer}>
            <MapContainer
              center={activityDetails.coordinates.lat ? [activityDetails.coordinates.lat, activityDetails.coordinates.lng] : [51.505, -0.09]}
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
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
          <button type="submit" className={styles.updateButton}>
            Update Activity
          </button>
        </form>
      )}
      {message && <div className={styles.message}>{message}</div>}
      <Footer />
    </div>
  );
};

export default UpdateActivity;
