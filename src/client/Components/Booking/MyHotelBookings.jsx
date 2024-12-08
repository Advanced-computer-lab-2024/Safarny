import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaHotel, FaCalendar, FaMapMarkerAlt, FaUsers, FaDollarSign, FaBed } from 'react-icons/fa';
import styles from './MyHotels.module.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const MyHotelBookings = () => {
    const location = useLocation();
    const [bookings, setBookings] = useState([]);
    const bookedBy = location.state?.bookedBy;

    const getMyBookings = async (bookedBy) => {
        try {
            const response = await fetch(`/tourist/getBookHotel/${bookedBy}`);
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
                        <h1 className="display-4 mb-3">My Hotel Bookings</h1>
                        {/* <p className="lead mb-0">View and manage your hotel reservations</p> */}
                    </div>
                {/* </div> */}

                <div className="container py-4 display-flex flex-column align-items-center justify-content-center">
                    {bookings.length > 0 ? (
                        <div className="row g-4">
                            {bookings.map((booking, index) => (
                                <div key={index} className="col-12">
                                    <div className={`${styles.bookingCard} card shadow-sm`}>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-4 mb-3 mb-md-0">
                                                    <h5 className="card-title d-flex align-items-center mb-3">
                                                        <FaHotel className="me-2 text-primary" />
                                                        Hotel Details
                                                    </h5>
                                                    <h6 className="mb-3">{booking.hotelName}</h6>
                                                    <div className={styles.locationInfo}>
                                                        <div className="d-flex align-items-center mb-2">
                                                            <FaMapMarkerAlt className="text-primary me-2" />
                                                            <span>{booking.hotelDistancefromCenter} km from center</span>
                                                        </div>
                                                    </div>
                                                    <div className={styles.roomInfo}>
                                                        <FaBed className="text-primary me-2" />
                                                        <span>{booking.roomType}</span>
                                                    </div>
                                                </div>

                                                <div className="col-md-4 mb-3 mb-md-0">
                                                    <h5 className="card-title d-flex align-items-center mb-3">
                                                        <FaCalendar className="me-2 text-primary" />
                                                        Stay Details
                                                    </h5>
                                                    <p className="mb-2">
                                                        <strong>Check-In:</strong><br />
                                                        {new Date(booking.checkInDate).toLocaleDateString()}
                                                    </p>
                                                    <p className="mb-0">
                                                        <strong>Check-Out:</strong><br />
                                                        {new Date(booking.checkOutDate).toLocaleDateString()}
                                                    </p>
                                                </div>

                                                <div className="col-md-4">
                                                    <h5 className="card-title d-flex align-items-center mb-3">
                                                        <FaUsers className="me-2 text-primary" />
                                                        Booking Details
                                                    </h5>
                                                    <div className="row g-2 mb-3">
                                                        <div className="col-auto">
                                                            <span className={styles.guestBadge}>
                                                                {booking.adults} Adults
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className={styles.descriptionBox}>
                                                        <p className="mb-2 small">
                                                            {booking.hotelDescription}
                                                        </p>
                                                    </div>
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
                        <div className={`${styles.emptyState}`}>
                            <FaHotel className="display-1 text-white mb-3" />
                            <h3>No Bookings Found</h3>
                            <p className={styles.emptyMessage}>You haven't made any hotel reservations yet.</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MyHotelBookings;
