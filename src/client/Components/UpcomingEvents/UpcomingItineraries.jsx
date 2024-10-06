import React, { useEffect, useState } from "react";
import styles from "./UpcomingActivities.module.css";
import Logo from "/src/client/Assets/Img/logo.png";
import Footer from "/src/client/components/Footer/Footer";
import { Link } from "react-router-dom";

const UpcomingItineraries = () => {
    const [itineraries, setItineraries] = useState([]);

    useEffect(() => {
        const fetchItineraries = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/guest/get-itineraries-sorted?sortBy=date:asc"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch itineraries");
                }
                const data = await response.json();
                console.log(data);
                setItineraries(data);
            } catch (error) {
                console.error("Error fetching itineraries:", error);
            }
        };

        fetchItineraries();
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
                <h2>Upcoming Itineraries</h2>
                <section className={styles.itineraryList}>
                    {itineraries.length === 0 ? (
                        <p>No upcoming itineraries found.</p>
                    ) : (
                        itineraries.map((itinerary) => (
                            <div key={itinerary._id} className={styles.itineraryItem}>
                                <h3>{itinerary.name}</h3>
                                <p>Duration: {itinerary.duration} hours</p>
                                <p>Language: {itinerary.language}</p>
                                <p>Price: {itinerary.price}$</p>
                                <p>Available Dates: {itinerary.availableDates.join(", ")}</p>
                                <p>Available Times: {itinerary.availableTimes.join(", ")}</p>
                                <p>Accessibility: {itinerary.accessibility ? "Yes" : "No"}</p>
                                <p>Pickup Location: {itinerary.pickupLocation}</p>
                                <p>Dropoff Location: {itinerary.dropoffLocation}</p>

                                {/* Display Tags */}
                                {itinerary.tags && itinerary.tags.length > 0 && (
                                    <p>Tags: {itinerary.tags.map((tag) => tag.name).join(", ")}</p>
                                )}

                                {/* Display Activities */}
                                {itinerary.activities && itinerary.activities.length > 0 && (
                                    <p>Activities: {itinerary.activities.map((activity) => activity.name).join(", ")}</p>
                                )}
                            </div>
                        ))
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default UpcomingItineraries;
