import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button, Collapse, Dropdown, DropdownButton, DropdownItem } from 'react-bootstrap';
import Logo from '/src/client/Assets/Img/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProfileHeader.css';

const ProfileHeader = ({ userId, userInfo }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBookingsButtons, setShowBookingsButtons] = useState(false);
  const [showComplaintsButtons, setShowComplaintsButtons] = useState(false);
  const [showTransportButtons, setShowTransportButtons] = useState(false);
  const [showPostButtons, setShowPostButtons] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleBackClick = () => navigate(-1);

  const renderRoleSpecificButtons = () => {
    if (userInfo.role === 'Tourist') {
      return (
        <>
          <DropdownButton variant="outline-light" title="View & Book Services" className="mb-2">
            <Dropdown.Item onClick={() => navigate('/BookFlight', { state: { userId } })}>Book A Flight</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate('/BookHotel', { state: { userId } })}>Book A Hotel</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate('/transportss/book-transport', { state: { userId } })}>Book Transport</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate('/mybookings', { state: { userId } })}>My Bookings</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate('/myorders', { state: { userId } })}>My Orders</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate('/PreferencesPage', { state: { userId } })}>Select Your Preferences</Dropdown.Item>
          </DropdownButton>

          <DropdownButton variant="outline-light" title="Manage Complaints" className="mb-2">
            <Dropdown.Item onClick={() => navigate('/createcomplaints', { state: { userId } })}>Create Complaint</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate('/viewcomplaints', { state: { userId } })}>View Complaints</Dropdown.Item>
          </DropdownButton>

          <DropdownButton variant="outline-light" title="View Upcoming Events" className="mb-2">
            <Dropdown.Item onClick={() => navigate('/UpcomingActivites', { state: { userId } })}>Upcoming Activities</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate('/UpcomingItineraries', { state: { userId } })}>Upcoming Itineraries</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate('/historical-places', { state: { userId } })}>Upcoming Historical Places</Dropdown.Item>
          </DropdownButton>
        </>
      );
    }

    if (userInfo.role === 'Seller') {
      return (
        <>
          <DropdownButton variant="outline-light" title="Manage Products" className="mb-2">
            <Dropdown.Item onClick={() => navigate('/create-post', { state: { userId } })}>Add Product</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate('/seller', { state: { userId } })}>My Products</Dropdown.Item>
          </DropdownButton>
        </>
      );
    }

    if (userInfo.role === 'Advertiser') {
      return (
        <>
          <DropdownButton variant="outline-light" title="Transportation and Activities" className="mb-2">
            <Dropdown.Item onClick={() => navigate('/AdvertiserMain', { state: { userId } })}>Activity</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate('/transportss/create-transport', { state: { userId } })}>Create Transport</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate('/transportss/edit-transport', { state: { userId } })}>Edit & Delete Transport</Dropdown.Item>
          </DropdownButton>
          <Button variant="outline-light" onClick={() => navigate('/Advertiser_Sales', { state: { userId } })}>Sales Report</Button>
        </>
      );
    }

    if (userInfo.role === 'TourGuide') {
      return (
        <>
          <Button variant="outline-light" onClick={() => navigate('/tourguide', { state: { userId } })}>Add Itinerary</Button>
          <Button variant="outline-light" onClick={() => navigate("/TourGuideSales", { state: { userId } })}>Sales Report</Button>
        </>
      );
    }

    return null;
  };

  return (
    <Navbar expand="lg" className="navbar-dark bg-dark sticky-top shadow-lg">
      <div className="container-fluid">
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <img src={Logo} alt="Logo" className="logo" />
          <h1 className="text-light ms-2 mb-0">Safarny</h1>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" onClick={toggleMenu} />
        <Navbar.Collapse id="navbarNav" className={`justify-content-end ${menuOpen ? 'show' : ''}`}>
          <Nav className="gap-3">
            <Button variant="outline-light" onClick={handleBackClick}>Back</Button>
            <Button variant="outline-light" onClick={() => navigate('/')}>Homepage</Button>
            <Button variant="outline-light" onClick={() => navigate('/products', { state: { userId } })}>Products</Button>
            <Button variant="outline-light" onClick={() => navigate('/Search')}>Search</Button>
            <Button variant="outline-light" onClick={() => { localStorage.setItem('userId', userId); window.location.href = '/UpdateProfile'; }}>
              Update
            </Button>
            {renderRoleSpecificButtons()}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default ProfileHeader;
