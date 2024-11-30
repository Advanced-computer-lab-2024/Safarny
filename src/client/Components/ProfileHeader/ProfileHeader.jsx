import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProfileHeader.module.css';
import Logo from '/src/client/Assets/Img/logo.png';

const ProfileHeader = ({ userId, userInfo }) => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    // State for submenu toggles
    const [showBookingsButtons, setShowBookingsButtons] = useState(false);
    const [showComplaintsButtons, setShowComplaintsButtons] = useState(false);
    const [showTransportationsButtons, setShowTransportButtons] = useState(false);
    const [showPostButtons, setShowPostButtons] = useState(false);
    const [showButtons, setShowButtons] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleBackClick = () => navigate(-1);

    const renderRoleSpecificButtons = () => {
        if (userInfo.role === 'Tourist') {
            return (
                <>
                    <button
                        onClick={() => setShowBookingsButtons(!showBookingsButtons)}
                        className={styles.mainButton}
                    >
                        View & Book Services
                    </button>
                    {showBookingsButtons && (
                        <div className={styles.subButtonGroup}>
                            <button onClick={() => navigate('/BookFlight', { state: { userId } })}>
                                Book A Flight
                            </button>
                            <button onClick={() => navigate('/BookHotel', { state: { userId } })}>
                                Book A Hotel
                            </button>
                            <button onClick={() => navigate('/transportss/book-transport', { state: { userId } })}>
                                Book Transport
                            </button>
                            <button onClick={() => navigate('/mybookings', { state: { userId } })}>
                                My Bookings
                            </button>
                            <button onClick={() => navigate('/PreferencesPage', { state: { userId } })}>
                                Select Your Preferences
                            </button>
                        </div>
                    )}
                    <button
                        onClick={() => setShowComplaintsButtons(!showComplaintsButtons)}
                        className={styles.mainButton}
                    >
                        Manage Complaints
                    </button>
                    {showComplaintsButtons && (
                        <div className={styles.subButtonGroup}>
                            <button onClick={() => navigate('/createcomplaints', { state: { userId } })}>
                                Create Complaint
                            </button>
                            <button onClick={() => navigate('/viewcomplaints', { state: { userId } })}>
                                View Complaints
                            </button>
                        </div>
                    )}
                    <button onClick={() => setShowButtons(!showButtons)} className={styles.mainButton}>
                        View Upcoming Events
                    </button>
                    {showButtons && (
                        <div className={styles.subButtonGroup}>
                            <button onClick={() => navigate('/UpcomingActivites', { state: { userId } })}>
                                Upcoming Activities
                            </button>
                            <button onClick={() => navigate('/UpcomingItineraries', { state: { userId } })}>
                                Upcoming Itineraries
                            </button>
                            <button onClick={() => navigate('/historical-places', { state: { userId } })}>
                                Upcoming Historical Places
                            </button>
                        </div>
                    )}
                </>
            );
        }

        if (userInfo.role === 'Seller') {
            return (
                <>
                    <button
                        onClick={() => setShowPostButtons(!showPostButtons)}
                        className={styles.mainButton}
                    >
                        Manage Products
                    </button>
                    {showPostButtons && (
                        <div className={styles.subButtonGroup}>
                            <button onClick={() => navigate('/create-post', { state: { userId } })}>
                                Add Product
                            </button>
                            <button onClick={() => navigate('/seller', { state: { userId } })}>
                                My Products
                            </button>
                        </div>
                    )}
                </>
            );
        }

        if (userInfo.role === 'Advertiser') {
            return (
                <>
                    <button
                        onClick={() => setShowTransportButtons(!showTransportationsButtons)}
                        className={styles.mainButton}
                    >
                        Transportation and Activities
                    </button>
                    {showTransportationsButtons && (
                        <div className={styles.subButtonGroup}>
                            <button onClick={() => navigate('/AdvertiserMain', { state: { userId } })}>
                                Activity
                            </button>
                            <button onClick={() => navigate('/transportss/create-transport', { state: { userId } })}>
                                Create Transport
                            </button>
                            <button onClick={() => navigate('/transportss/edit-transport', { state: { userId } })}>
                                Edit & Delete Transport
                            </button>
                        </div>
                    )}
                </>
            );
        }

        if (userInfo.role === 'TourGuide') {
            return (
                <button onClick={() => navigate('/tourguide', { state: { userId } })} className={styles.mainButton}>
                    Add Itinerary
                </button>
            );
        }

        return null;
    };

    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <img src={Logo} alt="Logo" className={styles.logo} />
                <h1 className={styles.title}>Safarny</h1>
            </div>
            <button className={styles.burgerMenu} onClick={toggleMenu}>
                ☰
            </button>
            <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
                <button onClick={handleBackClick} className={styles.mainButton}>
                    Back
                </button>
                <button onClick={() => navigate('/')} className={styles.mainButton}>
                    Homepage
                </button>

                <div className={styles.mainButton}>
                    <button onClick={() => navigate('/products', { state: { userId } })} className={styles.mainButton}>
                        View Products
                    </button>
                    <button onClick={() => navigate('/Search')} className={styles.mainButton}>
                        Search
                    </button>
                    <button
                        onClick={() => {
                            localStorage.setItem('userId', userId);
                            window.location.href = '/UpdateProfile';
                        }}
                        className={styles.mainButton}
                    >
                        Update Profile
                    </button>
                </div>
                {renderRoleSpecificButtons()}
            </nav>
        </header>
    );
};

export default ProfileHeader;
