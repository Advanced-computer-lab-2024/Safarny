import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import styles from './ProfileSideBar.module.css';

const ProfileSideBar = ({ userId, userInfo }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    // State for submenu toggles
    const [showBookingsButtons, setShowBookingsButtons] = useState(false);
    const [showComplaintsButtons, setShowComplaintsButtons] = useState(false);
    const [showTransportationsButtons, setShowTransportButtons] = useState(false);
    const [showPostButtons, setShowPostButtons] = useState(false);
    const [showButtons, setShowButtons] = useState(false);
    const handleDelete = async () => {
        if (userInfo.role === "Seller") {
          axios.put(`/seller/delete_request/${userId}`, { delete_request: true });
        }
        else if (userInfo.role === "TourGuide") {
          axios.put(`/tourGuide/delete_request/${userId}`, { delete_request: true });
        }
        else if (userInfo.role === "Tourist") {
          axios.put(`/tourist/delete_request/${userId}`, { delete_request: true });
        }
        else if (userInfo.role === "Advertiser") {
          axios.put(`/advertiser/delete_request/${userId}`, { delete_request: true });
        }
      };

      const handleProductViewClick = () => {
        navigate("/products", { state: { userId } });
      };

      const handleUpdateClick2 = () => {
        navigate("/Search");
      };

      const handleUpdateClick = () => {
        localStorage.setItem("userId", userId);
        window.location.href = "/UpdateProfile";
      };

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
            <div className={styles.toggleButton} onClick={toggleSidebar}>
                {isOpen ? '←' : '→'}
            </div>
            {isOpen && (
                <div className={styles.content}>
                    {/* <button className={styles.notificationButton}>
                        <FaBell />
                    </button> */}
                    <h1>Welcome, {userInfo.username}!</h1>

                    <div className={styles.mainButton}>
                        <button onClick={handleDelete}>Request Account To be Deleted</button>
                    </div>
                    <div className={styles.buttonGroup}>
                        <button onClick={handleProductViewClick} className={styles.mainButton}>
                            View Products
                        </button>
                        <button onClick={handleUpdateClick2} className={styles.mainButton}>
                            Search
                        </button>
                        <button onClick={handleUpdateClick} className={styles.mainButton}>
                            Update Profile
                        </button>
                    </div>

                    {userInfo.role === 'Tourist' && (
                        <div className={styles.buttonGroup}>
                            <button onClick={() => setShowBookingsButtons(!showBookingsButtons)} className={styles.mainButton}>
                                View & Book Services
                            </button>
                            {showBookingsButtons && (
                                <div className={styles.subButtonGroup}>
                                    <button onClick={() => navigate('/BookFlight', { state: { userId } })} className={styles.subButton}>
                                        Book A Flight
                                    </button>
                                    <button onClick={() => navigate('/BookHotel', { state: { userId } })} className={styles.subButton}>
                                        Book A Hotel
                                    </button>
                                    <button onClick={() => navigate('/transportss/book-transport', { state: { userId } })} className={styles.subButton}>
                                        Book Transports
                                    </button>
                                    <button onClick={() => navigate('/mybookings', { state: { userId } })} className={styles.subButton}>
                                        My Bookings
                                    </button>
                                    <button onClick={() => navigate('/myorders', { state: { userId } })} className={styles.subButton}>
                                        My Orders
                                    </button>
                                    <button onClick={() => navigate('/PreferencesPage', { state: { userId } })} className={styles.subButton}>
                                        Select Your Preferences
                                    </button>
                                </div>
                            )}

                            <button onClick={() => setShowComplaintsButtons(!showComplaintsButtons)} className={styles.mainButton}>
                                Manage Complaints
                            </button>
                            {showComplaintsButtons && (
                                <div className={styles.subButtonGroup}>
                                    <button onClick={() => navigate('/createcomplaints', { state: { userId } })} className={styles.subButton}>
                                        Create Complaint
                                    </button>
                                    <button onClick={() => navigate('/viewcomplaints', { state: { userId } })} className={styles.subButton}>
                                        View Complaints
                                    </button>
                                </div>
                            )}

                            <button onClick={() => setShowButtons(!showButtons)} className={styles.mainButton}>
                                View Upcoming Events
                            </button>
                            {showButtons && (
                                <div className={styles.subButtonGroup}>
                                    <button onClick={() => navigate('/UpcomingActivites', { state: { userId } })} className={styles.subButton}>
                                        Upcoming Activities
                                    </button>
                                    <button onClick={() => navigate('/UpcomingItineraries', { state: { userId } })} className={styles.subButton}>
                                        Upcoming Itineraries
                                    </button>
                                    <button onClick={() => navigate('/historical-places', { state: { userId } })} className={styles.subButton}>
                                        Upcoming Historical Places
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {userInfo.role === 'Seller' && (
                        <div className={styles.buttonGroup}>
                            <button onClick={() => setShowPostButtons(!showPostButtons)} className={styles.mainButton}>
                                Manage Products
                            </button>
                            {showPostButtons && (
                                <div className={styles.subButtonGroup}>
                                    <button onClick={() => navigate('/create-post', { state: { userId } })} className={styles.subButton}>
                                        Add Product
                                    </button>
                                    <button onClick={() => navigate('/seller', { state: { userId } })} className={styles.subButton}>
                                        My Products
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {userInfo.role === 'Advertiser' && (
                        <div className={styles.buttonGroup}>
                            <button onClick={() => setShowTransportButtons(!showTransportationsButtons)} className={styles.mainButton}>
                                Transportation and Activities
                            </button>
                            {showTransportationsButtons && (
                                <div className={styles.subButtonGroup}>
                                    <button onClick={() => navigate('/AdvertiserMain', { state: { userId } })} className={styles.subButton}>
                                        Activity
                                    </button>
                                    <button onClick={() => navigate('/transportss/create-transport', { state: { userId } })} className={styles.subButton}>
                                        Create Transport
                                    </button>
                                    <button onClick={() => navigate('/transportss/edit-transport', { state: { userId } })} className={styles.subButton}>
                                        Edit & Delete Transport
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {userInfo.role === 'TourGuide' && (
                        <div className={styles.buttonGroup}>
                            <button onClick={() => navigate('/tourguide', { state: { userId } })} className={styles.postButton}>
                                Add Itinerary
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfileSideBar;
