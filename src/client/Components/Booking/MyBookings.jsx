import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./MyBookings.module.css";
import Header from "/src/client/Components/Header/Header";
import Footer from "/src/client/Components/Footer/Footer";
import axios from "axios";
import { CircularProgress, MenuItem, Select, FormControl, InputLabel, Button } from "@mui/material";
import { FaCalendar, FaMapMarkerAlt, FaUser, FaStar, FaComments, FaHistory, FaClock } from "react-icons/fa";

const MyBookings = () => {
        const location = useLocation();
        const navigate = useNavigate(); // Added navigate hook
        const { userId } = location.state || {};
        const [bookings, setBookings] = useState([]);
        const [loading, setLoading] = useState(true);
        const [walletCurrency, setWalletCurrency] = useState("USD");
        const [exchangeRates, setExchangeRates] = useState({});
        const [tourGuideRatings, setTourGuideRatings] = useState({});
        const [comments, setComments] = useState({});  // Store comments by activityId ///
        const [selectedRating, setSelectedRating] = useState({});
        const [submittedRatings, setSubmittedRatings] = useState(() => {
                const savedRatings = localStorage.getItem("submittedRatings");
                return savedRatings ? JSON.parse(savedRatings) : {};
        });
        const [submittedTourGuideRatings, setSubmittedTourGuideRatings] = useState(() => {
                const savedRatings = localStorage.getItem("submittedTourGuideRatings");
                return savedRatings ? JSON.parse(savedRatings) : {};
        });
        const [showUpcoming, setShowUpcoming] = useState(false);
        const [showPast, setShowPast] = useState(false);

        const fetchBookings = async () => {
                try {
                        const response = await axios.get(`/tourist/bookings/${userId}`);
                        const bookingsWithTourGuide = await Promise.all(
                                response.data.map(async (booking) => {
                                        try {
                                                let tourGuideUsername = null;
                                                let tourGuideId = null;
                                                let activityComments = [];
                                                let iteneraryComments = [];
                                                let tourGuideComments = [];

                                                if (booking.itinerary && booking.itinerary._id) {
                                                        const itineraryResponse = await axios.get(`/itineraries/${booking.itinerary._id}`);
                                                        try {
                                                                if (booking.itinerary && booking.itinerary._id) {
                                                                        const iteneraryCommentsResponse = await axios.get(`/tourist/comments/itinerary/${booking.itinerary._id}`);
                                                                        iteneraryComments = iteneraryCommentsResponse.data;
                                                                }
                                                        } catch (error) {
                                                                console.error("Error fetching comments for itinerary:", error);
                                                        }
                                                        tourGuideId = itineraryResponse.data.createdby;
                                                } else if (booking.activity && booking.activity._id) {
                                                        const activityResponse = await axios.get(`/activities/${booking.activity._id}`);
                                                        tourGuideId = activityResponse.data.createdby;
                                                        try {
                                                                if (booking.activity && booking.activity._id) {
                                                                        const activityCommentsResponse = await axios.get(`/tourist/comments/activity/${booking.activity._id}`);
                                                                        activityComments = activityCommentsResponse.data;
                                                                }
                                                        } catch (error) {
                                                                console.error("Error fetching comments for activity:", error);
                                                        }
                                                }
                                                if (tourGuideId && /^[a-fA-F0-9]{24}$/.test(tourGuideId)) {
                                                        try {
                                                                const tourGuideResponse = await axios.get(`/tourist/${tourGuideId}`);
                                                                tourGuideUsername = tourGuideResponse.data.username;
                                                                try {
                                                                        if (tourGuideId && /^[a-fA-F0-9]{24}$/.test(tourGuideId)) {
                                                                                const tourGuideCommentsResponse = await axios.get(`/tourist/comments/tourguide/${tourGuideId}`);
                                                                                tourGuideComments = tourGuideCommentsResponse.data;
                                                                        }
                                                                } catch (error) {
                                                                        console.error("Error fetching comments for tour guide:", error);
                                                                }
                                                        } catch (error) {
                                                                if (error.response && error.response.status === 404) {
                                                                        console.error(`Tour guide profile not found for ID ${tourGuideId}`);
                                                                } else {
                                                                        throw error;
                                                                }
                                                        }
                                                }

                                                return {
                                                        ...booking,
                                                        tourGuideUsername,
                                                        tourGuideId,
                                                        rating: 5,
                                                        activityComments,
                                                        iteneraryComments,
                                                        tourGuideComments
                                                };
                                        } catch (error) {
                                                console.error(`Error fetching details for booking ${booking._id || "unknown"}:`, error);
                                                return {
                                                        ...booking,
                                                        tourGuideUsername: "Unknown",
                                                        tourGuideId: null,
                                                        rating: 5,
                                                        activityComments: [],
                                                        iteneraryComments: [],
                                                        tourGuideComments: []
                                                };
                                        }
                                })
                        );
                        setBookings(bookingsWithTourGuide);
                } catch (error) {
                        console.error("Error fetching bookings:", error);
                        alert("An error occurred while fetching bookings. Please try again later.");
                } finally {
                        setLoading(false);
                }
        };

        const fetchExchangeRates = async () => {
                try {
                        const response = await fetch(import.meta.env.VITE_EXCHANGE_API_URL);
                        if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        const data = await response.json();
                        if (!data.conversion_rates) {
                                throw new Error("Invalid data format");
                        }
                        setExchangeRates(data.conversion_rates);
                } catch (error) {
                        console.error("Error fetching exchange rates:", error);
                        setExchangeRates({ USD: 1 });
                }
        };

        const convertPrice = (price, fromCurrency, toCurrency) => {
                if (price == null) {
                        return "N/A";
                }
                const rateFrom = exchangeRates[fromCurrency] || 1;
                const rateTo = exchangeRates[toCurrency] || 1;
                return ((price / rateFrom) * rateTo).toFixed(2);
        };

        const handleRatingChange = async (bookingId, rating, bookingType, bookingTypeId) => {
                try {
                        let endpoint = "";
                        if (bookingType === "itinerary") {
                                endpoint = `/itineraries/updaterating/${bookingTypeId}`;
                        } else if (bookingType === "activity") {
                                endpoint = `/activities/updaterating/${bookingTypeId}`;
                        } else if (bookingType === "historicalPlace") {
                                endpoint = `/historicalplaces/updaterating/${bookingTypeId}`;
                        }

                        await axios.put(endpoint, { rating });
                        setBookings((prevBookings) =>
                                prevBookings.map((booking) =>
                                        booking._id === bookingId ? { ...booking, rating } : booking
                                )
                        );
                        const updatedRatings = { ...submittedRatings, [bookingId]: true };
                        setSubmittedRatings(updatedRatings);
                        localStorage.setItem("submittedRatings", JSON.stringify(updatedRatings));
                } catch (error) {
                        console.error("Error updating rating:", error);
                }
        };

        const handleTourGuideRatingChange = async (tourGuideId, rating) => {
                try {
                        const stringTourGuideId = String(tourGuideId);
                        if (!/^[a-fA-F0-9]{24}$/.test(stringTourGuideId)) {
                                throw new Error("Invalid tour guide ID");
                        }
                        await axios.put(`/tourguide/updaterating/`, { id: stringTourGuideId, newRating: rating });
                        setTourGuideRatings((prevRatings) => ({
                                ...prevRatings,
                                [stringTourGuideId]: rating,
                        }));
                        const updatedRatings = { ...submittedTourGuideRatings, [stringTourGuideId]: true };
                        setSubmittedTourGuideRatings(updatedRatings);
                        localStorage.setItem("submittedTourGuideRatings", JSON.stringify(updatedRatings));
                } catch (error) {
                        console.error("Error updating tour guide rating:", error);
                }
        };

        const handleCancelBooking = async (booking) => {
                try {
                        if (booking.historicalPlace) {
                                await axios.put(
                                        `/tourist/bookings/${booking._id}/cancel/historicalPlace`
                                );
                        } else if (booking.activity) {
                                await axios.put(
                                        `/tourist/bookings/${booking._id}/cancel`
                                );
                        } else if (booking.itinerary) {
                                await axios.put(
                                        `/tourist/bookings/${booking._id}/cancel`
                                );
                        }
                        fetchBookings();
                } catch (error) {
                        console.error("Error cancelling booking:", error);
                }
        };

        const isPastDate = (date) => {
                return new Date(date) < new Date();
        };

        // Button handlers for navigation
        const handleNavigateToCommentForTourGuide = (booking) => {
                navigate(`/create-comment-tourguide/${booking.tourGuideId}`, { state: { bookingId: booking._id } });
        };

        const handleNavigateToCommentForItinerary = (booking) => {
                navigate(`/create-comment-itinerary/${booking.itinerary._id}`, { state: { bookingId: booking._id } });
        };

        const handleNavigateToCommentForActivity = (booking) => {
                navigate(`/create-comment-activity/${booking.activity._id}`, { state: { bookingId: booking._id } });
        };


        const sendReminderEmail = async () => {
                try {
                        // Fetch the user's email using the userId
                        const userResponse = await axios.get(`/tourist/${userId}`);
                        const userEmail = userResponse.data.email;
                        const userName = userResponse.data.name;

                        // Fetch the data for the activities/itineraries
                        const activitiesResponse = await axios.get(`/tourist/activities/${userId}`);
                        const itinerariesResponse = await axios.get(`/tourist/itineraries/${userId}`);
                        const activities = Array.isArray(activitiesResponse.data) ? activitiesResponse.data : [];
                        const itineraries = Array.isArray(itinerariesResponse.data) ? itinerariesResponse.data : [];

                        // Filter activities and itineraries to include only those after today
                        const today = new Date();
                        const upcomingActivities = activities.filter(activity => new Date(activity.date) > today);
                        const upcomingItineraries = itineraries.filter(itinerary => new Date(itinerary.date) > today);

                        // Format the data into a single string
                        const formattedActivities = upcomingActivities.map(activity => `Activity: ${activity.name}, Location: ${activity.location}`).join('\n');
                        const formattedItineraries = upcomingItineraries.map(itinerary => `Itinerary: ${itinerary.name}, Description: ${itinerary.description}`).join('\n');
                        const formattedData = `Activities:\n${formattedActivities}\n\nItineraries:\n${formattedItineraries}`;

                        // Send the email with the formatted string
                        await axios.post("/email/send-tourist-reminder-email", {
                                email: userEmail,
                                name: userName,
                                eventName: "Your Upcoming Activities and Itineraries",
                                eventDate: new Date().toLocaleDateString(), // Example event date
                                data: formattedData
                        });

                        console.log("Reminder email sent successfully");
                } catch (error) {
                        console.error("Error sending reminder email:", error);
                }
        };

        const sendReminderNotification = async (userId) => {
                try {
                        // Fetch the user's bookings using the userId
                        const bookingsResponse = await axios.get(`/tourist/bookings/${userId}`);
                        const bookings = bookingsResponse.data;

                        // Loop over the bookings and send a notification for each booking after today
                        const today = new Date();
                        for (const booking of bookings) {
                                if (new Date(booking.bookingDate) > today) {
                                        const title = `Reminder for your booking on ${booking.bookingDate}`;
                                        const message = `You have a booking for ${booking.itinerary ? booking.itinerary.name : booking.activity ? booking.activity.location : 'an activity'} on ${booking.bookingDate}.`;

                                        const response = await axios.post('/notification/create', {
                                                title,
                                                message,
                                                userId,
                                        });
                                        console.log('Notification sent successfully:', response.data);
                                }
                        }
                } catch (error) {
                        console.error('Error sending notification:', error);
                }
        };

        const filterUpcomingBookings = () => {
                setShowUpcoming(true);
                setShowPast(false);
        };

        const filterPastBookings = () => {
                setShowPast(true);
                setShowUpcoming(false);
        };

        const isUpcoming = (date) => {
                return new Date(date) > new Date();
        };

        const isPast = (date) => {
                return new Date(date) < new Date();
        };

        const filteredBookings = bookings.filter(booking => {
                if (showUpcoming) {
                        return isUpcoming(booking.bookingDate);
                }
                if (showPast) {
                        return isPast(booking.bookingDate);
                }
                return true; // Show all if no filter is applied
        });

        useEffect(() => {
                if (userId) {
                        fetchBookings();
                        fetchExchangeRates();
                        sendReminderEmail();
                        sendReminderNotification(userId);
                }
        }, [userId]);

        return (
                <div className={`${styles.pageWrapper} min-vh-100 width-vw-100 d-flex flex-column`}>
                        <Header />

                        <main className="flex-grow-1">
                                {/* <div className={styles.heroSection}> */}
                                        <div className="container text-center text-white">
                                                <h1 className="display-4 mb-3">My Bookings</h1>
                                                {/* <p className="lead">Manage your travel experiences</p> */}
                                        </div>
                                {/* </div> */}

                                <div className="container py-4">
                                        <div className={`${styles.filterSection} mb-4`}>
                                                <div className="d-flex justify-content-center gap-3">
                                                        <button
                                                                onClick={filterUpcomingBookings}
                                                                className={`btn ${showUpcoming ? 'btn-primary' : 'btn-outline-primary'} ${styles.filterButton}`}
                                                        >
                                                                <FaClock className="me-2" />
                                                                Upcoming Bookings
                                                        </button>
                                                        <button
                                                                onClick={filterPastBookings}
                                                                className={`btn ${showPast ? 'btn-primary' : 'btn-outline-primary'} ${styles.filterButton}`}
                                                        >
                                                                <FaHistory className="me-2" />
                                                                Past Bookings
                                                        </button>
                                                </div>
                                        </div>

                                        {loading ? (
                                                <div className="text-center py-5">
                                                        <CircularProgress />
                                                        <p className="text-muted mt-3">Loading your bookings...</p>
                                                </div>
                                        ) : filteredBookings.length === 0 ? (
                                                <div className={styles.emptyState}>
                                                        <FaCalendar className="display-1 text-muted mb-3" />
                                                        <h3>No Bookings Found</h3>
                                                        <p className="text-white">You haven't made any bookings yet.</p>
                                                </div>
                                        ) : (
                                                <div className="row g-4">
                                                        {filteredBookings.map((booking) => {
                                                                const bookingType = booking.itinerary ? "itinerary" : booking.activity ? "activity" : "historicalPlace";

                                                                return (
                                                                        <div key={booking._id} className="col-md-6 col-lg-4">
                                                                                <div className={`${styles.bookingCard} card h-100 shadow-sm`}>
                                                                                        <div className={`card-header ${styles.bookingHeader}`}>
                                                                                                <div className="d-flex align-items-center mb-2">
                                                                                                        <FaCalendar className="text-primary me-2" />
                                                                                                        <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                                                                                                </div>
                                                                                                <span className={`badge ${isPastDate(booking.bookingDate) ? 'bg-secondary' : 'bg-primary'}`}>
                                                                                                        {isPastDate(booking.bookingDate) ? 'Completed' : 'Upcoming'}
                                                                                                </span>
                                                                                        </div>

                                                                                        <div className="card-body">
                                                                                                {booking.itinerary && (
                                                                                                        <div className="mb-3">
                                                                                                                <h5 className="card-title">
                                                                                                                        <FaMapMarkerAlt className="text-primary me-2" />
                                                                                                                        {booking.itinerary.name}
                                                                                                                </h5>
                                                                                                                <p className="text-muted">{booking.itinerary.location}</p>
                                                                                                        </div>
                                                                                                )}

                                                                                                {booking.activity && (
                                                                                                        <div className="mb-3">
                                                                                                                <h5 className={`card-title ${styles.activityTitle}`}>
                                                                                                                        <FaMapMarkerAlt className="text-primary me-2" />
                                                                                                                        Activity at {booking.activity.location}
                                                                                                                </h5>
                                                                                                        </div>
                                                                                                )}

                                                                                                {booking.historicalPlace && (
                                                                                                        <div className="mb-3">
                                                                                                                <h5 className="card-title">
                                                                                                                        <FaMapMarkerAlt className="text-primary me-2" />
                                                                                                                        Historical Place
                                                                                                                </h5>
                                                                                                                <p className="text-muted">{booking.historicalPlace.description}</p>
                                                                                                                <p className="text-primary fw-bold">
                                                                                                                        Price: {convertPrice(booking.historicalPlace.ticketPrices, booking.historicalPlace.currency, walletCurrency)} {walletCurrency}
                                                                                                                </p>
                                                                                                        </div>
                                                                                                )}

                                                                                                {booking.tourGuideId && (
                                                                                                        <div className={styles.tourGuideSection}>
                                                                                                                <div className="d-flex align-items-center mb-3">
                                                                                                                        <FaUser className="text-primary me-2" />
                                                                                                                        <span>Guide: {booking.tourGuideUsername}</span>
                                                                                                                </div>

                                                                                                                {isPastDate(booking.bookingDate) && !submittedTourGuideRatings[booking.tourGuideId] && (
                                                                                                                        <div className={styles.ratingSection}>
                                                                                                                                <FormControl fullWidth size="small">
                                                                                                                                        <InputLabel>Rate Guide</InputLabel>
                                                                                                                                        <Select
                                                                                                                                                value={tourGuideRatings[booking.tourGuideId] || 5}
                                                                                                                                                onChange={(e) => setTourGuideRatings({
                                                                                                                                                        ...tourGuideRatings,
                                                                                                                                                        [booking.tourGuideId]: e.target.value
                                                                                                                                                })}
                                                                                                                                        >
                                                                                                                                                {[1, 2, 3, 4, 5].map((rating) => (
                                                                                                                                                        <MenuItem key={rating} value={rating}>
                                                                                                                                                                {rating} <FaStar className="ms-1 text-warning" />
                                                                                                                                                        </MenuItem>
                                                                                                                                                ))}
                                                                                                                                        </Select>
                                                                                                                                        <Button
                                                                                                                                                variant="contained"
                                                                                                                                                size="small"
                                                                                                                                                onClick={() => handleTourGuideRatingChange(
                                                                                                                                                        booking.tourGuideId,
                                                                                                                                                        tourGuideRatings[booking.tourGuideId]
                                                                                                                                                )}
                                                                                                                                                className="mt-2"
                                                                                                                                        >
                                                                                                                                                Submit Rating
                                                                                                                                        </Button>
                                                                                                                                </FormControl>
                                                                                                                        </div>
                                                                                                                )}
                                                                                                                {isPastDate(booking.bookingDate) && !submittedRatings[booking._id] && (
                                                                                                                    <div className={styles.ratingSection}>
                                                                                                                            <FormControl fullWidth size="small">
                                                                                                                                    <InputLabel>Rate {bookingType === "itinerary" ? "Itinerary" : "Activity"}</InputLabel>
                                                                                                                                    <Select
                                                                                                                                        value={selectedRating[booking._id] || 5}
                                                                                                                                        onChange={(e) => setSelectedRating({
                                                                                                                                                ...selectedRating,
                                                                                                                                                [booking._id]: e.target.value
                                                                                                                                        })}
                                                                                                                                    >
                                                                                                                                            {[1, 2, 3, 4, 5].map((rating) => (
                                                                                                                                                <MenuItem key={rating} value={rating}>
                                                                                                                                                        {rating} <FaStar className="ms-1 text-warning" />
                                                                                                                                                </MenuItem>
                                                                                                                                            ))}
                                                                                                                                    </Select>
                                                                                                                                    <Button
                                                                                                                                        variant="contained"
                                                                                                                                        size="small"
                                                                                                                                        onClick={() => handleRatingChange(
                                                                                                                                            booking._id,
                                                                                                                                            selectedRating[booking._id],
                                                                                                                                            bookingType,
                                                                                                                                            bookingType === "itinerary" ? booking.itinerary._id : booking.activity._id
                                                                                                                                        )}
                                                                                                                                        className="mt-2"
                                                                                                                                    >
                                                                                                                                            Submit Rating
                                                                                                                                    </Button>
                                                                                                                            </FormControl>
                                                                                                                    </div>
                                                                                                                )}
                                                                                                        </div>
                                                                                                )}
                                                                                        </div>

                                                                                        <div className="card-footer bg-transparent">
                                                                                                <div className="d-flex flex-wrap gap-2">
                                                                                                        {booking.status === "confirmed" && (
                                                                                                                <>
                                                                                                                        {booking.itinerary && (
                                                                                                                                <>
                                                                                                                                        <button
                                                                                                                                                className="btn btn-outline-primary btn-sm"
                                                                                                                                                onClick={() => handleNavigateToCommentForTourGuide(booking)}
                                                                                                                                        >
                                                                                                                                                <FaComments className="me-1" />
                                                                                                                                                Guide Review
                                                                                                                                        </button>
                                                                                                                                        <button
                                                                                                                                                className="btn btn-outline-primary btn-sm"
                                                                                                                                                onClick={() => handleNavigateToCommentForItinerary(booking)}
                                                                                                                                        >
                                                                                                                                                <FaComments className="me-1" />
                                                                                                                                                Itinerary Review
                                                                                                                                        </button>
                                                                                                                                </>
                                                                                                                        )}
                                                                                                                        {booking.activity && (
                                                                                                                                <button
                                                                                                                                        className="btn btn-outline-primary btn-sm"
                                                                                                                                        onClick={() => handleNavigateToCommentForActivity(booking)}
                                                                                                                                >
                                                                                                                                        <FaComments className="me-1" />
                                                                                                                                        Activity Review
                                                                                                                                </button>
                                                                                                                        )}
                                                                                                                </>
                                                                                                        )}
                                                                                                        {booking.status === "active" && (
                                                                                                                <button
                                                                                                                        className="btn btn-danger btn-sm ms-auto"
                                                                                                                        onClick={() => handleCancelBooking(booking)}
                                                                                                                >
                                                                                                                        Cancel Booking
                                                                                                                </button>
                                                                                                        )}
                                                                                                </div>
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                );
                                                        })}
                                                </div>
                                        )}
                                </div>
                        </main>

                        <Footer />
                </div>
        );
};

export default MyBookings;