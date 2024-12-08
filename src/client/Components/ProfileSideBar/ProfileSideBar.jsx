import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaPlane, FaHotel, FaCar, FaBook, FaShoppingBag, 
    FaUser, FaExclamationCircle, FaList, FaCalendar,
    FaMapMarked, FaStore, FaPlus, FaChartLine,
    FaShip, FaCog, FaMap, FaClipboard, FaUserCog, FaTrash,
    FaChevronRight, FaChevronDown, FaSearch, FaArrowLeft,
    FaBars, FaTimes
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
        { name: "Back", icon: <FaArrowLeft />, action: () => navigate(-1) },
        { name: "Products", icon: <FaStore />, action: () => navigate('/products', { state: { userId } }) },
        { name: "Search", icon: <FaSearch />, action: () => navigate('/Search') },
        { name: "Update Profile", icon: <FaCog />, action: () => {
            localStorage.setItem('userId', userId);
            window.location.href = '/UpdateProfile';
        }},
    ];

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
                ]
            }
        ]
    };

    return (
        <>
            {/* Toggle Button */}
            <button 
                className={`btn btn-dark ${styles.toggleButton}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Sidebar */}
            <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className="p-3">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <div className="d-flex align-items-center">
                            <FaUserCog className="me-2" />
                            <h5 className="mb-0">User Menu</h5>
                        </div>
                        <button 
                            className="btn btn-link text-dark"
                            onClick={() => setIsOpen(false)}
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Common Actions */}
                    <div className="mb-4">
                        <div className="d-flex flex-wrap gap-2">
                            {commonItems.map((item, index) => (
                                <button
                                    key={index}
                                    className="btn btn-outline-secondary"
                                    onClick={item.action}
                                >
                                    {item.icon}
                                    <span className="ms-2">{item.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Delete Account Button */}
                    <div className="mb-4">
                        <button 
                            className="btn btn-outline-danger w-100 mb-2"
                            onClick={handleDelete}
                        >
                            <FaTrash className="me-2" />
                            Delete Account
                        </button>
                    </div>

                    {/* Role Specific Menu */}
                    <div className="nav flex-column">
                        {menuItems[userInfo.role]?.map((menu, index) => (
                            <div key={index} className="mb-2">
                                <button
                                    className="btn btn-light w-100 text-start d-flex align-items-center justify-content-between"
                                    onClick={() => setActiveMenu(activeMenu === menu.title ? null : menu.title)}
                                >
                                    <span>
                                        {menu.icon}
                                        <span className="ms-2">{menu.title}</span>
                                    </span>
                                    {activeMenu === menu.title ? <FaChevronDown /> : <FaChevronRight />}
                                </button>
                                
                                <div className={`collapse ${activeMenu === menu.title ? 'show' : ''}`}>
                                    <div className="ps-3 pt-2">
                                        {menu.subItems.map((item, idx) => (
                                            <button
                                                key={idx}
                                                className="btn btn-link text-decoration-none text-muted w-100 text-start py-1"
                                                onClick={() => {
                                                    navigate(item.path, { state: { userId } });
                                                    setIsOpen(false);
                                                }}
                                            >
                                                {item.icon}
                                                <span className="ms-2">{item.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Overlay */}
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
