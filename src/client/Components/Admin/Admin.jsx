import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavDropdown, Container, Row, Col, Card, Button, Form, ListGroup, Modal } from 'react-bootstrap';
import SideBar from '../SideBar/SideBar';
import {
  TextField,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import { Checkbox, FormControlLabel } from '@mui/material';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../../server/config/Firebase';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './Admin.module.css';
import Logo from '/src/client/Assets/Img/logo.png';
import Footer from '../Footer/Footer';
import Tags from './tagAdmin';
import ActivityCategory from './ActivityCategory';


const Admin = () => {
  const location = useLocation();
  const [activeView, setActiveView] = useState("");
  const { userId } = location.state || {};
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    role: "",
    image: "", // Added image field
  });
  const [userRole, setUserRole] = useState('');

  const [openModal, setOpenModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState({ details: '', price: '', currency: '', quantity: '', imageurl: '' });
  const [promoCodeModalOpen, setPromoCodeModalOpen] = useState(false);
  const [promoCodeData, setPromoCodeData] = useState({
    discountPercentage: '',
    activated: true,
    createdBy: userId || '', // Set current user ID
    code: '',
    expiryDate: '',
  });

  const [editingPostId, setEditingPostId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSection, setSelectedSection] = useState('posts');
  const [currencyCodes, setCurrencyCodes] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  // Search, Filter, and Sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState(''); // Add selectedCurrency state

  // total number of users
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersThisMonth, setUsersThisMonth] = useState(0);

  //header items
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleManageTagsClick = () => {
    setActiveView("tags");
  };

  const handleManageCategoriesClick = () => {
    setActiveView("categories");
  };

  const handleClearFilter = () => {
    setActiveView("");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (selectedSection === 'posts') {
      fetchPosts();
    }
  }, [selectedSection]);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(`.${styles.header}`);
      if (window.scrollY > 50) {
        header.classList.add(styles.translucent);
      } else {
        header.classList.remove(styles.translucent);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const fetchUserRole = async () => {
    try {
      const response = await axios.get(`/tourist/${userId}`);
      const user = response.data;
      setUserRole(user.role);
      console.log('User role:', user.role);
    } catch (err) {
      console.error('Error fetching user role:', err);
    }
  };

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_EXCHANGE_API_URL);
        const data = await response.json();
        setCurrencyCodes(Object.keys(data.conversion_rates));
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchExchangeRates();
    fetchUserRole();
  }, []);

  const fetchPosts = async () => {
    setLoading(true); // Set loading to true before fetching posts
    try {
      const response = await axios.get('/admin/products');
      setPosts(response.data);
    } catch (error) {
      setErrorMessage('Failed to fetch posts');
    } finally {
      setLoading(false); // Set loading to false after posts are fetched
    }
  };


  const fetchUserCounts = async () => {
    try {
      const response = await axios.get('/admin/userCounts');
      setTotalUsers(response.data.totalUsers);
      setUsersThisMonth(response.data.usersThisMonth);
      setLoading(false); // Data fetched, set loading to false
    } catch (error) {
      console.error('Error fetching user counts:', error);
      setErrorMessage('Failed to fetch user counts');
      setLoading(false); // Even if error occurs, stop loading
    }
  };





  // console.log(fetchUserCounts);




  useEffect(() => {
    fetchUserCounts();
  }, []);




  const handleOpenModal = () => {
    setCurrentPost({ details: '', price: '', currency: '', quantity: '', imageurl: '' });
    setEditingPostId(null);
    setOpenModal(true);
  };

  const handleOpenPromoCodeModal = () => {
    setPromoCodeData({
      discountPercentage: '',
      activated: true,
      createdBy: userId || '', // Set the current user's ID as the creator
      code: '',
      expiryDate: '',
    });
    setPromoCodeModalOpen(true); // Open the promo code modal
  };

  const handleClosePromoCodeModal = () => {
    setPromoCodeModalOpen(false); // Close the promo code modal
    setErrorMessage(''); // Clear any existing error messages
  };


  const handleCloseModal = () => {
    setOpenModal(false);
    setErrorMessage('');
    setSelectedImage(null);
  };





  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPost({ ...currentPost, [name]: value });
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleSubmitPost = async () => {
    let imageUrl = currentPost.imageurl;

    if (selectedImage) {
      imageUrl = await uploadImage(selectedImage);
      if (!imageUrl) return;
    }

    const postData = { ...currentPost, imageurl: imageUrl };

    console.log('Submitting post data:', postData); // Log the postData

    try {
      if (editingPostId) {
        await axios.put(`/admin/products/${editingPostId}`, postData);
      } else {
        await axios.post('/admin/createProduct', postData);
      }
      fetchPosts();
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting post:', error); // Log the error
      setErrorMessage(`Failed to ${editingPostId ? 'update' : 'add'} post`);
    }
  };

  const handleEditPost = (post) => {
    setCurrentPost(post);
    setEditingPostId(post._id);
    setOpenModal(true);
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`/admin/products/${postId}`);
      fetchPosts();
    } catch (error) {
      setErrorMessage('Failed to delete post');
    }
  };

  const handleArchiveChange = async (postId) => {
    try {
      await axios.put(`/admin/products/${postId}`, { archived: true });
      fetchPosts();
    } catch (error) {
      setErrorMessage('Failed to update archive status');
    }
  };
  const handleUpcomingItinerariesClick = () => {
    navigate("/UpcomingItineraries", { state: { userId } });
  };
  const handleUpcomingActivitiesClick = () => {
    navigate("/UpcomingActivites", { state: { userId } });
  };
  const handleSubmitPromoCode = async () => {
    const promoCodeDataToSubmit = { ...promoCodeData };

    console.log('Submitting promo code data:', promoCodeDataToSubmit);

    try {
      await axios.post('/admin/promocodes', promoCodeDataToSubmit);

      // Display a success alert


      //fetchPromoCodes(); // Refresh the list of promo codes (if needed)
      handleClosePromoCodeModal();
      alert('Promo code successfully added!');
    } catch (error) {
      console.error('Error submitting promo code:', error);
      setErrorMessage('Failed to add promo code');
    }
  };




  const handleArchiveToggle = async (postId, isArchived) => {
    try {
      // Update the local state first
      setPosts(posts.map(post =>
        post._id === postId ? { ...post, archived: isArchived } : post
      ));
      console.log("Local state updated");

      // Make a request to the server to update the archived status
      await axios.put(`/admin/products/${postId}`, { archived: isArchived });
      console.log("Archived status updated successfully");

    } catch (error) {
      console.error("Error updating archived status:", error);
      // Optionally, revert the local state if the API call fails
      setPosts(posts.map(post =>
        post._id === postId ? { ...post, archived: !isArchived } : post
      ));
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice =
      (minPrice === '' || post.price >= minPrice) &&
      (maxPrice === '' || post.price <= maxPrice);
    const matchesCurrency = selectedCurrency === '' || post.currency === selectedCurrency;
    return matchesSearch && matchesPrice && matchesCurrency;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return 0;
  });

  return (
    <div className={styles.container}>
      <Navbar bg="light" expand="lg" className={`${styles.header} ${window.scrollY > 50 ? styles.translucent : ''}`}>
        <Container>
          <Navbar.Brand>
            <img src={Logo} alt="Safarny Logo" height="40" className="d-inline-block align-top me-2" />
            <span className={styles.heading}>Safarny</span>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link onClick={handleBackClick}>Back</Nav.Link>
              
              {/* Content Management Dropdown */}
              <NavDropdown title="Content Management" id="basic-nav-dropdown" color="light">
                <NavDropdown.Item onClick={handleOpenModal}>Add Post</NavDropdown.Item>
                <NavDropdown.Item onClick={handleOpenPromoCodeModal}>Add PromoCode</NavDropdown.Item>
                <NavDropdown.Item onClick={() => setSelectedSection('tags')}>Manage Tags</NavDropdown.Item>
                <NavDropdown.Item onClick={() => setSelectedSection('ActivityCategory')}>
                  Manage Categories
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/adminaddgovernor">Add Governor</NavDropdown.Item>
              </NavDropdown>

              {/* Monitoring Dropdown */}
              <NavDropdown title="Monitoring" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={handleUpcomingItinerariesClick}>View Itineraries</NavDropdown.Item>
                <NavDropdown.Item onClick={handleUpcomingActivitiesClick}>View Activities</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/adminviewcomplaints">View Complaints</NavDropdown.Item>
              </NavDropdown>

              <Nav.Link as={Link} to="/">Log out</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="mt-4" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <Row>
          {/* Sidebar */}
            <SideBar className={`${styles.sidebar} position-fixed`} />

          {/* Main Content */}
          <Col md={12}>
            {/* User Stats Cards */}
            <Row className="mb-4">
              <Col md={6}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    {loading ? (
                      <div className="text-center">
                        <CircularProgress />
                      </div>
                    ) : errorMessage ? (
                      <Alert variant="danger">{errorMessage}</Alert>
                    ) : (
                      <>
                        <Card.Title>User Statistics</Card.Title>
                        <ListGroup variant="flush">
                          <ListGroup.Item>Total Users: {totalUsers}</ListGroup.Item>
                          <ListGroup.Item>Users This Month: {usersThisMonth}</ListGroup.Item>
                        </ListGroup>
                      </>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Filters Section */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Card.Title className="mb-3">Filters</Card.Title>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Search by Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="number"
                        placeholder="Min Price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="number"
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Select
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                      >
                        <option value="">Select Currency</option>
                        {currencyCodes.map((code) => (
                          <option key={code} value={code}>{code}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Check
                      type="checkbox"
                      label="Sort By Rating"
                      checked={sortBy === 'rating'}
                      onChange={(e) => setSortBy(e.target.checked ? 'rating' : '')}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Content Section */}
            {loading ? (
              <div className="text-center my-5">
                <CircularProgress />
              </div>
            ) : (
              <>
                {selectedSection === 'posts' && (
                  <Row>
                    {sortedPosts.map((post) => (
                      <Col key={post._id} lg={4} md={6} className="mb-4">
                        <Card className="h-100 shadow-sm">
                          <Card.Img 
                            variant="top" 
                            src={post.imageurl} 
                            style={{ height: '200px', objectFit: 'cover' }}
                          />
                          <Card.Body>
                            <Card.Title>{post.details}</Card.Title>
                            <ListGroup variant="flush" className="mb-3">
                              <ListGroup.Item>Price: {post.price} {post.currency}</ListGroup.Item>
                              <ListGroup.Item>Quantity: {post.quantity}</ListGroup.Item>
                              <ListGroup.Item>Purchased: {post.purchasedCount}</ListGroup.Item>
                              <ListGroup.Item>Sales: {post.purchasedCount * post.price}</ListGroup.Item>
                            </ListGroup>
                            <Form.Check
                              type="switch"
                              id={`archive-switch-${post._id}`}
                              label="Archive"
                              checked={post.archived}
                              onChange={(e) => handleArchiveToggle(post._id, e.target.checked)}
                              className="mb-3"
                            />
                            <div className="d-flex justify-content-between">
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => handleEditPost(post)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleDeletePost(post._id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
                {selectedSection === 'tags' && <Tags />}
                {selectedSection === 'ActivityCategory' && <ActivityCategory />}
              </>
            )}
          </Col>
        </Row>
      </Container>

      <Modal show={promoCodeModalOpen} onHide={handleClosePromoCodeModal} centered>
        {/* ... Promo Code Modal content ... */}
      </Modal>

      <Modal show={openModal} onHide={handleCloseModal} centered>
        {/* ... Add/Edit Post Modal content ... */}
      </Modal>

      <Footer />
    </div>
  );
}
export default Admin;