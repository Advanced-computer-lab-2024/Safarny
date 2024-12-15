import React from 'react';
import styles from './Profile.module.css';

const Calendar = ({ bookings }) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const hasBooking = (day) => {
        return bookings?.some(booking => {
            const bookingDate = new Date(booking.bookingDate);
            return bookingDate.getDate() === day &&
                bookingDate.getMonth() === currentMonth &&
                bookingDate.getFullYear() === currentYear;
        });
    };

    return (
        <div>
            <h6 className="text-center mb-3">{monthNames[currentMonth]} {currentYear}</h6>
            <div className={styles.calendarGrid}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className={`${styles.calendarDay} fw-bold text-muted`}>
                        {day.charAt(0)}
                    </div>
                ))}

                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className={styles.calendarDay} />
                ))}

                {days.map(day => (
                    <div
                        key={day}
                        className={`${styles.calendarDay} ${hasBooking(day) ? styles.hasBooking : ''}`}
                        title={hasBooking(day) ? 'You have bookings on this day' : ''}
                    >
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar; 