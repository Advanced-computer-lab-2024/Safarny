import React, { useEffect, useState } from "react";
import styles from "./UpcomingActivities.module.css";
import Logo from "/src/client/Assets/Img/logo.png";
import Footer from "/src/client/components/Footer/Footer";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

const UpcomingActivities = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/guest/get-activities-sorted?sortBy=date:asc"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch activities");
        }
        const data = await response.json();
        console.log(data);
        setActivities(data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src={Logo} alt="Safarny Logo" className={styles.logo} />
        <h1>Safarny</h1>
        <nav className={styles.nav}>
          <Link to="/" className={styles.button}>
            Back to Home
          </Link>
        </nav>
      </header>
      <main className={styles.main}>
        <h2>Upcoming Activities</h2>
        <section className={styles.activityList}>
          {activities.length === 0 ? (
            <p>No upcoming activities found.</p>
          ) : (
            activities.map((activity) => (
              <div key={activity._id} className={styles.activityItem}>
                <h3>{activity.name}</h3>
                <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
                <p>Time: {activity.time}</p>
                <p>Location: {activity.location}</p>
                <p>Price: {activity.price}$</p>

                {activity.specialDiscount && (
                  <p>Discount: {activity.specialDiscount}</p>
                )}

                {/* Display Tags */}
                {activity.tags && activity.tags.length > 0 && (
                  <p>Tags: {activity.tags.map((tag) => tag.name).join(", ")}</p>
                )}

                {/* Display Categories */}
                {activity.category && activity.category.length > 0 && (
                  <p>
                    Category:{" "}
                    {activity.category.map((cat) => cat.type).join(", ")}
                  </p>
                )}

                {/* Map Container */}
                <div className={styles.mapContainer}>
                  <MapContainer
                    center={[activity.coordinates.lat || 51.505, activity.coordinates.lng || -0.09]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {activity.coordinates.lat && activity.coordinates.lng && (
                      <Marker position={[activity.coordinates.lat, activity.coordinates.lng]} />
                    )}
                  </MapContainer>
                </div>

                <p style={{ color: activity.bookingOpen ? "green" : "red" }}>
                  {activity.bookingOpen ? "Booking Open" : "Booking Closed"}
                </p>
              </div>
            ))
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default UpcomingActivities;
