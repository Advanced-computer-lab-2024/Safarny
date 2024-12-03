import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FaSearch, FaCog, FaArrowLeft } from 'react-icons/fa'; // Font Awesome Icons
import Logo from '/src/client/Assets/Img/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProfileHeader.css';

const ProfileHeader = ({ userId, userInfo }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleBackClick = () => navigate(-1);

  const renderRoleSpecificButtons = () => {
    if (userInfo.role === 'Tourist') {
      return (
        <>
          <OverlayTrigger placement="bottom" overlay={<Tooltip>Book a Flight</Tooltip>}>
            <Button variant="outline-light" onClick={() => navigate('/BookFlight', { state: { userId } })}>
              ✈️
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={<Tooltip>Book a Hotel</Tooltip>}>
            <Button variant="outline-light" onClick={() => navigate('/BookHotel', { state: { userId } })}>
              🏨
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={<Tooltip>Book Trasnportation</Tooltip>}>
            <Button variant="outline-light" onClick={() => navigate('/transportss/book-transport', { state: { userId } })}>
              🚗
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={<Tooltip>My Bookings</Tooltip>}>
            <Button variant="outline-light" onClick={() => navigate('/mybookings', { state: { userId } })}>
              📖
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={<Tooltip>My Orders</Tooltip>}>
            <Button variant="outline-light" onClick={() => navigate('/myorders', { state: { userId } })}>
              ✔️
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={<Tooltip>My Preferences</Tooltip>}>
            <Button variant="outline-light" onClick={() => navigate('/PreferencesPage', { state: { userId } })}>
              🪪
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={<Tooltip>Create a Complaint</Tooltip>}>
            <Button variant="outline-light" onClick={() => navigate('/createcomplaints', { state: { userId } })}>
              💢
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={<Tooltip>View my Complaints</Tooltip>}>
            <Button variant="outline-light" onClick={() => navigate('/viewcomplaints', { state: { userId } })}>
              👀
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={<Tooltip>View Upcoming Activities</Tooltip>}>
            <Button variant="outline-light" onClick={() => navigate('/UpcomingActivites', { state: { userId } })}>
              🏃
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={<Tooltip>View Available Itineraries</Tooltip>}>
            <Button variant="outline-light" onClick={() => navigate('/UpcomingItineraries', { state: { userId } })}>
              📰
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={<Tooltip>View Historical Places</Tooltip>}>
            <Button variant="outline-light" onClick={() => navigate('/historical-places', { state: { userId } })}>
              🏰
            </Button>
          </OverlayTrigger>
        </>
      );
    }

    if (userInfo.role === 'Seller') {
      return (
        <>
          <OverlayTrigger placement="bottom" overlay={<Tooltip>Manage Products</Tooltip>}>
            <Button variant="outline-light" onClick={() => navigate('/seller', { state: { userId } })}>
              🛒
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={<Tooltip>Add Product</Tooltip>}>
            <Button variant="outline-light" onClick={() => navigate('/create-post', { state: { userId } })}>
              🪛
            </Button>
          </OverlayTrigger>
        </>
      );
    }

    if (userInfo.role === 'Advertiser') {
      return (
        <>
          <OverlayTrigger placement="bottom" overlay={<Tooltip>View Sales Report</Tooltip>}>
            <Button variant="outline-light" onClick={() => navigate('/Advertiser_Sales', { state: { userId } })}>
              📊
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={<Tooltip>Activity</Tooltip>}>
            <Button variant="outline-light" onClick={() => navigate('/AdvertiserMain', { state: { userId } })}>
              🚣
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={<Tooltip>Create Transport</Tooltip>}>
            <Button variant="outline-light" onClick={() => navigate('/transportss/create-transport', { state: { userId } })}>
              🚘
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={<Tooltip>Manage Transport</Tooltip>}>
            <Button variant="outline-light" onClick={() => navigate('/transportss/edit-transport', { state: { userId } })}>
              ⛭🚘
            </Button>
          </OverlayTrigger>
        </>
      );
    }

    if (userInfo.role === 'TourGuide') {
      return (
        <>
          <OverlayTrigger placement="bottom" overlay={<Tooltip>Add Itinerary</Tooltip>}>
            <Button variant="outline-light" onClick={() => navigate('/tourguide', { state: { userId } })}>
              🗺️
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={<Tooltip>Sales Report</Tooltip>}>
            <Button variant="outline-light" onClick={() => navigate('/TourGuideSales', { state: { userId } })}>
              📊
            </Button>
          </OverlayTrigger>
        </>
      );
    }

    if (userInfo.role === 'TourismGovernor') {
      return (
          <OverlayTrigger placement="bottom" overlay={<Tooltip>Create Historical Tag</Tooltip>}>
            <Button variant="outline-light" onClick={() => navigate('/historical-tags', { state: { userId } })}>
              📜
            </Button>
          </OverlayTrigger>
      );
    }

    return null;
  };

  return (
    <Navbar expand="lg" className="navbar-dark bg-dark shadow-lg">
      <div className="container">
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <img src={Logo} alt="Logo" className="logo" />
          <span className="text-light ms-2">Safarny</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" onClick={toggleMenu} />
        <Navbar.Collapse id="navbarNav" className={`justify-content-end ${menuOpen ? 'show' : ''}`}>
          <Nav className="gap-3">
            <OverlayTrigger placement="bottom" overlay={<Tooltip>Back</Tooltip>}>
              <Button variant="outline-light" onClick={handleBackClick}>
                <FaArrowLeft />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>Products</Tooltip>}>
              <Button variant="outline-light" onClick={() => navigate('/products', { state: { userId } })}>
                🛍️
              </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>Search</Tooltip>}>
              <Button variant="outline-light" onClick={() => navigate('/Search')}>
                <FaSearch />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>Update Profile</Tooltip>}>
              <Button
                variant="outline-light"
                onClick={() => {
                  localStorage.setItem('userId', userId);
                  window.location.href = '/UpdateProfile';
                }}
              >
                <FaCog />
              </Button>
            </OverlayTrigger>
            {renderRoleSpecificButtons()}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default ProfileHeader;
