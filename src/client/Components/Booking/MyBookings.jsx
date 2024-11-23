import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./MyBookings.module.css";
import Header from "/src/client/components/Header/Header";
import Footer from "/src/client/components/Footer/Footer";
import axios from "axios";
import {CircularProgress, MenuItem, Select, FormControl, InputLabel, Button} from "@mui/material";
import mongoose from "mongoose";

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

  const fetchBookings = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/tourist/bookings/${userId}`);
    const bookingsWithTourGuide = await Promise.all(
      response.data.map(async (booking) => {
        try {
          let tourGuideUsername = null;
          let tourGuideId = null;
          let activityComments = [];
          let iteneraryComments = [];
          let tourGuideComments = [];

          if (booking.itinerary && booking.itinerary._id) {
            const itineraryResponse = await axios.get(`http://localhost:3000/itineraries/${booking.itinerary._id}`);
            try {
              if (booking.itinerary && booking.itinerary._id) {
                const iteneraryCommentsResponse = await axios.get(`http://localhost:3000/tourist/comments/itinerary/${booking.itinerary._id}`);
                iteneraryComments = iteneraryCommentsResponse.data;
              }
            } catch (error) {
              console.error("Error fetching comments for itinerary:", error);
            }
            tourGuideId = itineraryResponse.data.createdby;
          } else if (booking.activity && booking.activity._id) {
            const activityResponse = await axios.get(`http://localhost:3000/activities/${booking.activity._id}`);
            tourGuideId = activityResponse.data.createdby;
            try {
              if (booking.activity && booking.activity._id) {
                const activityCommentsResponse = await axios.get(`http://localhost:3000/tourist/comments/activity/${booking.activity._id}`);
                activityComments = activityCommentsResponse.data;
              }
            } catch (error) {
              console.error("Error fetching comments for activity:", error);
            }
          }
          if (tourGuideId && /^[a-fA-F0-9]{24}$/.test(tourGuideId)) {
            try {
              const tourGuideResponse = await axios.get(`http://localhost:3000/tourist/${tourGuideId}`);
              tourGuideUsername = tourGuideResponse.data.username;
              try {
                if (tourGuideId && /^[a-fA-F0-9]{24}$/.test(tourGuideId)) {
                  const tourGuideCommentsResponse = await axios.get(`http://localhost:3000/tourist/comments/tourguide/${tourGuideId}`);
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
        endpoint = `http://localhost:3000/itineraries/updaterating/${bookingTypeId}`;
      } else if (bookingType === "activity") {
        endpoint = `http://localhost:3000/activities/updaterating/${bookingTypeId}`;
      } else if (bookingType === "historicalPlace") {
        endpoint = `http://localhost:3000/historicalplaces/updaterating/${bookingTypeId}`;
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
      await axios.put(`http://localhost:3000/tourguide/updaterating/`, { id: stringTourGuideId, newRating: rating });
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
          `http://localhost:3000/tourist/bookings/${booking._id}/cancel/historicalPlace`
        );
      } else if (booking.activity) {
        await axios.put(
          `http://localhost:3000/tourist/bookings/${booking._id}/cancel`
        );
      } else if (booking.itinerary) {
        await axios.put(
          `http://localhost:3000/tourist/bookings/${booking._id}/cancel`
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
    const userResponse = await axios.get(`http://localhost:3000/tourist/${userId}`);
    const userEmail = userResponse.data.email;
    const userName = userResponse.data.name;

    // Fetch the data for the activities/itineraries
    const activitiesResponse = await axios.get(`http://localhost:3000/tourist/activities/${userId}`);
    const itinerariesResponse = await axios.get(`http://localhost:3000/tourist/itineraries/${userId}`);
    const activities = Array.isArray(activitiesResponse.data) ? activitiesResponse.data : [];
    const itineraries = Array.isArray(itinerariesResponse.data) ? itinerariesResponse.data : [];

    // Format the data into a single string
    const formattedActivities = activities.map(activity => `Activity: ${activity.name}, Location: ${activity.location}`).join('\n');
    const formattedItineraries = itineraries.map(itinerary => `Itinerary: ${itinerary.name}, Description: ${itinerary.description}`).join('\n');
    const formattedData = `Activities:\n${formattedActivities}\n\nItineraries:\n${formattedItineraries}`;

    // Send the email with the formatted string
    await axios.post("http://localhost:3000/email/send-tourist-reminder-email", {
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
      const bookingsResponse = await axios.get(`http://localhost:3000/tourist/bookings/${userId}`);
      const bookings = bookingsResponse.data;

      // Loop over the bookings and send a notification for each booking
      for (const booking of bookings) {
        const title = `Reminder for your booking on ${booking.bookingDate}`;
        const message = `You have a booking for ${booking.itinerary ? booking.itinerary.name : booking.activity ? booking.activity.name : 'an activity'} on ${booking.bookingDate}.`;

        const response = await axios.post('http://localhost:3000/notification/create', {
          title,
          message,
          userId,
        });
        console.log('Notification sent successfully:', response.data);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBookings();
      fetchExchangeRates();
      sendReminderEmail();
      sendReminderNotification(userId);
    }
  }, [userId]);

  return (
    <div className={styles.container}>
      <Header />
      <h1>My Bookings</h1>

      {loading ? (
        <div className={styles.loadingContainer}>
          <CircularProgress />
        </div>
      ) : bookings.length === 0 ? (
        <p className={styles.noBookingsText}>No bookings found.</p>
      ) : (
        <ul className={styles.bookingList}>
          {bookings.map((booking) => {
            const bookingType = booking.itinerary
              ? "itinerary"
              : booking.activity
              ? "activity"
              : booking.historicalPlace
              ? "historicalPlace"
              : null;

            const bookingTypeId = booking.itinerary && booking.itinerary._id
              ? booking.itinerary._id
              : booking.activity && booking.activity._id
              ? booking.activity._id
              : booking.historicalPlace && booking.historicalPlace._id
              ? booking.historicalPlace._id
              : null;

            const tourGuideInfo = `Tour Guide: ${booking.tourGuideUsername}`;

            return (
              <li key={booking._id} className={styles.bookingCard}>
                <div className={styles.bookingDetails}>
                  <p>Booking Date: {booking.bookingDate}</p>
                  {booking.itinerary && <p>Itinerary: {booking.itinerary.name}</p>}

                  {/* Displaying Activity details */}
                  {booking.activity && (
                    <>
                      <p>Activity: {booking.activity.location}</p>

                      {/* Display the comments for the activity */}
                      {Array.isArray(booking.activityComments) && booking.activityComments.length > 0 ? (
                        <div>
                          <h3>Comments for this Activity:</h3>
                          <ul>
                            {booking.activityComments.map((comment, index) => (
                              <li key={index}>{comment.comment}</li>  // Adjust to match your comment structure
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p>No comments yet for this activity.</p>
                      )}
                    </>
                  )}
                  {booking.itinerary && (
                      <>
                        <p>Itinerary: {booking.itinerary.location}</p>

                        {/* Display the comments for the activity */}
                        {Array.isArray(booking.iteneraryComments) && booking.iteneraryComments.length > 0 ? (
                            <div>
                              <h3>Comments for this Itinerary:</h3>
                              <ul>
                                {booking.iteneraryComments.map((comment, index) => (
                                    <li key={index}>{comment.comment}</li>  // Adjust to match your comment structure
                                ))}
                              </ul>
                            </div>
                        ) : (
                            <p>No comments yet for this itinerary.</p>
                        )}
                      </>
                  )}
                  {booking.tourGuideId && booking.tourGuideUsername && (
                      <>
                        <p>Tour Guide: {booking.tourGuideUsername}</p>

                        {/* Display the comments for the tour guide */}
                        {Array.isArray(booking.tourGuideComments) && booking.tourGuideComments.length > 0 ? (
                        <div>
                          <h3>Comments for this Tour Guide:</h3>
                            <ul>
                              {booking.tourGuideComments.map((comment, index) => (
                                  <li key={index}>{comment.comment}</li>  // Adjust to match your comment structure
                              ))}
                            </ul>
                        </div>
                        ) : (
                            <p>No comments yet for this tour guide.</p>
                        )}
                      </>
                  )}
                  {booking.historicalPlace && (
                    <p>Historical Place: {booking.historicalPlace.description}</p>
                  )}
                  {booking.historicalPlace && (
                    <p>
                      Historical Place price:{" "}
                      {convertPrice(
                        booking.historicalPlace.ticketPrices,
                        booking.historicalPlace.currency,
                        walletCurrency
                      )}{" "}
                      {walletCurrency}
                    </p>
                  )}

                  {/* Tour guide details */}
                  {booking.tourGuideId && booking.tourGuideUsername && (
                      <>
                        <p>Tour Guide: {booking.tourGuideUsername}</p>
                        {!isPastDate(booking.bookingDate) && !submittedTourGuideRatings[booking.tourGuideId] && (
                            <FormControl fullWidth margin="normal">
                              <InputLabel>Rate this tour guide</InputLabel>
                              <Select
                                  value={tourGuideRatings[booking.tourGuideId] || 5}
                                  onChange={(e) =>
                                      setTourGuideRatings({ ...tourGuideRatings, [booking.tourGuideId]: e.target.value })
                                  }
                              >
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <MenuItem key={rating} value={rating}>
                                      {rating}
                                    </MenuItem>
                                ))}
                              </Select>
                              <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() =>
                                      handleTourGuideRatingChange(booking.tourGuideId, tourGuideRatings[booking.tourGuideId])
                                  }
                                  style={{ marginTop: '10px' }}
                              >
                                Submit
                              </Button>
                            </FormControl>
                        )}
                        {submittedTourGuideRatings[booking.tourGuideId] && <p>Tour Guide Rating submitted.</p>}
                      </>
                  )}

                  {isPastDate(booking.bookingDate) && <p>Status: Finished</p>}
                  {!isPastDate(booking.bookingDate) && (
                    <p className={`${styles.bookingStatus} ${styles[booking.status]}`}>
                      Status: {booking.status}
                    </p>
                  )}

                  {/* New button logic for navigation */}
                  {booking.status === "confirmed" && booking.itinerary && (
                    <>
                      <button onClick={() => handleNavigateToCommentForTourGuide(booking)}>
                        Comment on Tour Guide
                      </button>
                      <button onClick={() => handleNavigateToCommentForItinerary(booking)}>
                        Comment on Itinerary
                      </button>
                    </>
                  )}

                  {booking.status === "confirmed" && booking.activity && (
                    <button onClick={() => handleNavigateToCommentForActivity(booking)}>
                      Comment on Activity
                    </button>
                  )}

                  {booking.status === "active" && (
                    <button
                      onClick={() => handleCancelBooking(booking)}
                      className={styles.cancelButton}
                    >
                      Cancel Booking
                    </button>
                  )}

                  {isPastDate(booking.bookingDate) && !submittedRatings[booking._id] && (
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Rate this booking</InputLabel>
                        <Select
                            value={selectedRating[booking._id] || booking.rating}
                            onChange={(e) =>
                                setSelectedRating({ ...selectedRating, [booking._id]: e.target.value })
                            }
                        >
                          {[1, 2, 3, 4, 5].map((rating) => (
                              <MenuItem key={rating} value={rating}>
                                {rating}
                              </MenuItem>
                          ))}
                        </Select>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() =>
                                handleRatingChange(booking._id, selectedRating[booking._id], bookingType, bookingTypeId)
                            }
                            style={{ marginTop: '10px' }}
                        >
                          Submit
                        </Button>
                      </FormControl>
                  )}
                  {submittedRatings[booking._id] && <p>Rating submitted.</p>}
</div>
</li>
);
})}
</ul>
)}
      <Footer />
    </div>
  );
};

export default MyBookings;
