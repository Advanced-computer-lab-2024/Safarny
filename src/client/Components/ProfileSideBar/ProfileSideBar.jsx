import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaPlane, FaHotel, FaCar, FaBook, FaShoppingBag, 
    FaUser, FaExclamationCircle, FaList, FaCalendar,
    FaMapMarked, FaStore, FaPlus, FaChartLine,
    FaShip, FaCog, FaMap, FaClipboard, FaUserCog, FaTrash,
    FaChevronRight, FaChevronDown, FaSearch, FaArrowLeft,
    FaBars, FaTimes, FaBell
} from 'react-icons/fa';
import styles from './ProfileSideBar.module.css';
import axios from 'axios';

const ProfileSideBar = ({ userId, userInfo }) => {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = async () => {
        const roleEndpoints = {
            "Seller": "/seller/delete_request/",
            "TourGuide": "/tourGuide/delete_request/",
            "Tourist": "/tourist/delete_request/",
            "Advertiser": "/advertiser/delete_request/"
        };
        
        const endpoint = roleEndpoints[userInfo.role];
        if (endpoint) {
            await axios.put(`${endpoint}${userId}`, { delete_request: true });
        }
    };

    // Common navigation items that appear for all roles
    const commonItems = [
        { name: "Notifications", icon: <FaBell />, action: () => {
            navigate('/notifications', { state: { userId } });
        }},
        { name: "Update Profile", icon: <FaCog />, action: () => {
            localStorage.setItem('userId', userId);
            window.location.href = '/UpdateProfile';
        }},
    ];

    // Add "Products" to commonItems for Tourist and Seller
    if (userInfo.role === 'Tourist') {
        commonItems.push({ name: "Search", icon: <FaSearch />, action: () => navigate('/Search') });
        commonItems.push({ name: "Shop", icon: <FaStore />, action: () => navigate('/products', { state: { userId } }) });
    }

    const menuItems = {
        Tourist: [
            {
                title: "Bookings & Services",
                icon: <FaBook />,
                subItems: [
                    { name: "Book Flight", icon: <FaPlane />, path: '/BookFlight' },
                    { name: "Book Hotel", icon: <FaHotel />, path: '/BookHotel' },
                    { name: "Book Transport", icon: <FaCar />, path: '/transportss/book-transport' },
                    { name: "My Bookings", icon: <FaList />, path: '/mybookings' },
                    { name: "My Orders", icon: <FaShoppingBag />, path: '/myorders' },
                    { name: "My Preferences", icon: <FaUser />, path: '/PreferencesPage' },
                ]
            },
            {
                title: "Complaints",
                icon: <FaExclamationCircle />,
                subItems: [
                    { name: "Create Complaint", icon: <FaPlus />, path: '/createcomplaints' },
                    { name: "View Complaints", icon: <FaList />, path: '/viewcomplaints' },
                ]
            },
            {
                title: "Upcoming Events",
                icon: <FaCalendar />,
                subItems: [
                    { name: "Activities", icon: <FaCalendar />, path: '/UpcomingActivites' },
                    { name: "Itineraries", icon: <FaMapMarked />, path: '/UpcomingItineraries' },
                    { name: "Historical Places", icon: <FaMapMarked />, path: '/historical-places' },
                ]
            }
        ],
        Seller: [
            {
                title: "Product Management",
                icon: <FaStore />,
                subItems: [
                    { name: "Add Product", icon: <FaPlus />, path: '/create-post' },
                    { name: "My Products", icon: <FaList />, path: '/seller' },
                    { name: "Sales Report", icon: <FaChartLine />, path: '/sellerSales' },
                    { name: "Shop", icon: <FaStore />, path: '/products' },
                ]
            }
        ],
        Advertiser: [
            {
                title: "Services",
                icon: <FaShip />,
                subItems: [
                    { name: "Activities", icon: <FaCalendar />, path: '/AdvertiserMain' },
                    { name: "Create Transport", icon: <FaPlus />, path: '/transportss/create-transport' },
                    { name: "Manage Transport", icon: <FaCog />, path: '/transportss/edit-transport' },
                    { name: "Sales Report", icon: <FaChartLine />, path: '/Advertiser_Sales' },
                ]
            }
        ],
        TourGuide: [
            {
                title: "Services",
                icon: <FaMap />,
                subItems: [
                    { name: "Add Itinerary", icon: <FaPlus />, path: '/tourguide' },
                    { name: "Sales Report", icon: <FaChartLine />, path: '/TourGuideSales' },
                ]
            }
        ],
        TourismGovernor: [
            {
                title: "Management",
                icon: <FaClipboard />,
                subItems: [
                    { name: "Historical Tags", icon: <FaMapMarked />, path: '/historical-tags' },
                    { name: "Historical Places", icon: <FaMapMarked />, path: '/historical-places' },
                ]
            }
        ]
    };

    return (
        <>
            <button 
                className={`btn btn-dark ${isOpen ? '': styles.toggleButton }`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
            >
                {!isOpen && <FaBars />}
            </button>

            <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.sidebarContent}>
                    <div className={styles.sidebarHeader}>
                        <div className="d-flex align-items-center">
                            <FaUserCog className="me-2" style={{ color: '#4a90e2' }} />
                            <h5 className="mb-0">User Menu</h5>
                        </div>
                        <button 
                            className="btn btn-link text-dark p-0"
                            onClick={() => setIsOpen(false)}
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className={styles.menuContainer}>
                        {/* Common Actions */}
                        <div className={styles.menuSection}>
                            {commonItems.map((item, index) => (
                                <button
                                    key={index}
                                    className={styles.menuItem}
                                    onClick={item.action}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </button>
                            ))}
                        </div>

                        {/* Role Specific Menu */}
                        <div className={styles.menuSection}>
                            {menuItems[userInfo.role]?.map((menu, index) => (
                                <div key={index} className={styles.menuGroup}>
                                    <button
                                        className={styles.menuItem}
                                        onClick={() => setActiveMenu(activeMenu === menu.title ? null : menu.title)}
                                    >
                                        {menu.icon}
                                        <span>{menu.title}</span>
                                        {activeMenu === menu.title ? 
                                            <FaChevronDown className="ms-auto" /> : 
                                            <FaChevronRight className="ms-auto" />
                                        }
                                    </button>
                                    
                                    <div className={`${styles.subMenu} ${activeMenu === menu.title ? styles.show : ''}`}>
                                        {menu.subItems?.map((item, idx) => (
                                            <button
                                                key={idx}
                                                className={styles.subMenuItem}
                                                onClick={() => {
                                                    navigate(item.path, { state: { userId } });
                                                    setIsOpen(false);
                                                }}
                                            >
                                                {item.icon}
                                                <span>{item.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delete Account Button */}
                    <div className={styles.deleteButtonContainer}>
                        <button 
                            className={styles.deleteButton}
                            onClick={handleDelete}
                        >
                            <FaTrash />
                            <span>Delete Account</span>
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div 
                    className={styles.overlay}
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default ProfileSideBar;
