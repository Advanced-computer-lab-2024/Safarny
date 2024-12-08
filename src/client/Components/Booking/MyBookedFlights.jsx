import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaPlane, FaCalendar, FaMapMarkerAlt, FaUsers, FaDollarSign } from 'react-icons/fa';
import styles from './MyFlights.module.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const MyBookedFlights = () => {
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const bookedBy = location.state?.bookedBy;

  const getMyBookings = async (touristId) => {
    try {
      const response = await fetch(`/tourist/getBookFlight/${touristId}`);
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useEffect(() => {
    if (bookedBy) {
      getMyBookings(bookedBy);
    }
  }, [bookedBy]);

  return (
    <div className={`${styles.pageWrapper} min-vh-100 d-flex flex-column`}>
      <Header />
      
      <main className="flex-grow-1">
        {/* <div className={styles.heroSection}> */}
          <div className="container text-center text-white">
            <h1 className="display-4 mb-3">My Booked Flights</h1>
            {/* <p className="lead mb-0">View and manage your flight bookings</p> */}
          </div>
        {/* </div> */}

        <div className="container py-4">
          {bookings.length > 0 ? (
            <div className="row g-4">
              {bookings.map((booking) => (
                <div key={booking._id} className="col-12">
                  <div className={`${styles.bookingCard} card shadow-sm`}>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4 mb-3 mb-md-0">
                          <h5 className="card-title d-flex align-items-center mb-3">
                            <FaPlane className="me-2 text-primary" />
                            Flight Details
                          </h5>
                          <p className="mb-2">
                            <strong>Flight Number:</strong> {booking.aircraft}
                          </p>
                          <div className={styles.routeInfo}>
                            <div className="d-flex align-items-center mb-2">
                              <FaMapMarkerAlt className="text-primary me-2" />
                              <span>{booking.originLocationCode}</span>
                            </div>
                            <div className="border-start border-2 ms-2 ps-3 my-2">
                              {booking.destinationLocationCode && (
                                <div className="mb-2">{booking.destinationLocationCode}</div>
                              )}
                              {booking.destinationLocationCode2 && (
                                <div>{booking.destinationLocationCode2}</div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 mb-3 mb-md-0">
                          <h5 className="card-title d-flex align-items-center mb-3">
                            <FaCalendar className="me-2 text-primary" />
                            Time Details
                          </h5>
                          <p className="mb-2">
                            <strong>Departure:</strong><br />
                            {new Date(booking.DepartureDate).toLocaleString()}
                          </p>
                          <p className="mb-0">
                            <strong>Arrival:</strong><br />
                            {new Date(booking.ArrivalDate).toLocaleString()}
                          </p>
                        </div>

                        <div className="col-md-4">
                          <h5 className="card-title d-flex align-items-center mb-3">
                            <FaUsers className="me-2 text-primary" />
                            Booking Details
                          </h5>
                          <div className="row g-2">
                            <div className="col-auto">
                              <span className={styles.passengerBadge}>
                                {booking.adults} Adults
                              </span>
                            </div>
                            {booking.children > 0 && (
                              <div className="col-auto">
                                <span className={styles.passengerBadge}>
                                  {booking.children} Children
                                </span>
                              </div>
                            )}
                            {booking.infants > 0 && (
                              <div className="col-auto">
                                <span className={styles.passengerBadge}>
                                  {booking.infants} Infants
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="mt-3 mb-2">
                            <strong>Class:</strong> {booking.travelClass}
                          </p>
                          <p className="mb-2">
                            <strong>Non Stop:</strong> {booking.nonStop ? "Yes" : "No"}
                          </p>
                          <div className={styles.priceTag}>
                            <FaDollarSign />
                            {booking.Price} EUR
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`${styles.emptyState} text-center py-5`}>
              <FaPlane className="display-1 text-muted mb-3" />
              <h3>No Bookings Found</h3>
              <p className="text-muted mb-0">You haven't made any flight bookings yet.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyBookedFlights;
