import React, { useEffect, useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';

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
        <div>
            <h2>My Hotel Bookings</h2>
            {bookings.length > 0 ? (
                bookings.map((booking, index) => (
                    <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                        <p><strong>Hotel ID:</strong> {booking.hotelid}</p>
                        <p><strong>Hotel Name:</strong> {booking.hotelName}</p>
                        <p><strong>Check-In Date:</strong> {booking.checkInDate}</p>
                        <p><strong>Check-Out Date:</strong> {booking.checkOutDate}</p>
                        <p><strong>Adults:</strong> {booking.adults}</p>
                        <p><strong>Room Type:</strong> {booking.roomType}</p>
                        <p><strong>Price:</strong> {booking.Price} Euro</p>
                        <p><strong>Distance from Center:</strong> {booking.hotelDistancefromCenter} km</p>
                        <p><strong>Description:</strong> {booking.hotelDescription}</p>
                    </div>
                ))
            ) : (
                <p>No bookings found.</p>
            )}
        </div>
    );
};

export default MyHotelBookings;
