import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavDropdown, Container, Row, Col, Card, Button, Form, ListGroup, Modal } from 'react-bootstrap';
import SideBar from '../SideBar/SideBar';
import ReactStars from 'react-rating-stars-component';
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
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Admin = () => {
  const location = useLocation();
  const [activeView, setActiveView] = useState("posts");
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

  // Add new state variables for analytics
  const [revenueData, setRevenueData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Monthly Revenue',
      data: [0, 0, 0, 0, 0, 0],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  });

  const [userTypeData, setUserTypeData] = useState({
    labels: ['Tourists', 'Tour Guides', 'Sellers', 'Advertisers'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0'
      ]
    }]
  });

  const handleManageTagsClick = () => {
    setActiveView("tags");
  };

  const handleManageCategoriesClick = () => {
    setSelectedSection('categories');
    setActiveView('categories');
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
    const averageRating = post.rating.length > 0 ?
        (post.rating.reduce((acc, val) => acc + val, 0) / post.rating.length).toFixed(1) : 0;
    const matchesCurrency = selectedCurrency === '' || post.currency === selectedCurrency;
    return matchesSearch && matchesPrice && matchesCurrency;
  });

  const sortedPosts = [...filteredPosts].map(post => {
    const averageRating = post.rating.length > 0
        ? (post.rating.reduce((acc, val) => acc + val, 0) / post.rating.length).toFixed(1)
        : 0;
    return { ...post, averageRating };
  }).sort((a, b) => {
    if (sortBy === 'rating') {
      return b.averageRating - a.averageRating;
    }
    return 0;
  });

  useEffect(() => {
    console.log('Selected Section:', selectedSection);
  }, [selectedSection]);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch revenue data
      const revenueResponse = await axios.get('/api/analytics/revenue');
      const monthlyRevenue = revenueResponse.data;
      
      // Fetch user distribution data
      const usersResponse = await axios.get('/api/analytics/users');
      const userDistribution = usersResponse.data;

      // Update revenue chart data
      setRevenueData({
        labels: monthlyRevenue.map(item => item.month),
        datasets: [{
          label: 'Monthly Revenue (EGP)',
          data: monthlyRevenue.map(item => item.amount),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          fill: true,
          backgroundColor: 'rgba(75, 192, 192, 0.1)'
        }]
      });

      // Update user distribution chart data
      setUserTypeData({
        labels: ['Tourists', 'Tour Guides', 'Sellers', 'Advertisers'],
        datasets: [{
          data: [
            userDistribution.tourists,
            userDistribution.tourGuides,
            userDistribution.sellers,
            userDistribution.advertisers
          ],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0'
          ]
        }]
      });

    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  // Add this useEffect to fetch data when component mounts
  useEffect(() => {
    fetchAnalyticsData();
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchAnalyticsData, 300000);
    
    return () => clearInterval(interval);
  }, []);

  // Add this component for the analytics section
  const AnalyticsSection = () => (
    <div className={styles.analyticsGrid}>
      <div className={styles.chartCard}>
        <h3>Revenue Trends</h3>
        <Line data={revenueData} options={{
          responsive: true,
          maintainAspectRatio: false
        }} />
      </div>
      <div className={styles.chartCard}>
        <h3>User Distribution</h3>
        <Doughnut data={userTypeData} options={{
          responsive: true,
          maintainAspectRatio: false
        }} />
      </div>
    </div>
  );

  return (
    <div className={styles.adminLayout}>
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
                <NavDropdown.Item onClick={() => setSelectedSection('posts')}>
                  Manage Posts
                </NavDropdown.Item>
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

      <div className={styles.mainContainer}>
        <SideBar className={`${styles.sidebar} ${styles.overlaySidebar}`} />

        <div className={styles.contentWrapper}>
          <Container className={styles.dashboardContainer}>
            <Row className="mb-4">
              <Col lg={3} md={6} className="mb-4">
                <Card className={`${styles.statsCard} h-100`}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-2">Total Users</h6>
                        <h3 className="mb-0">{totalUsers}</h3>
                      </div>
                      <div className={`${styles.iconBox} ${styles.primaryBox}`}>
                        <i className="fas fa-users"></i>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3} md={6} className="mb-4">
                <Card className={`${styles.statsCard} h-100`}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-2">Monthly Users</h6>
                        <h3 className="mb-0">{usersThisMonth}</h3>
                      </div>
                      <div className={`${styles.iconBox} ${styles.successBox}`}>
                        <i className="fas fa-user-plus"></i>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col lg={6} md={12} className="mb-4">
                <Card className={`${styles.chartCard} h-100`}>
                  <Card.Body>
                    <h5 className="mb-4">Revenue Trends</h5>
                    <div className={styles.chartContainer}>
                      <Line 
                        data={revenueData} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom'
                            }
                          }
                        }} 
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6} md={12} className="mb-4">
                <Card className={`${styles.chartCard} h-100`}>
                  <Card.Body>
                    <h5 className="mb-4">User Distribution</h5>
                    <div className={styles.chartContainer}>
                      <Doughnut 
                        data={userTypeData} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom'
                            }
                          }
                        }} 
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={12}>
                <Card className={styles.actionCard}>
                  <Card.Body>
                    <h5 className="mb-4">Quick Actions</h5>
                    <div className="d-flex gap-3">
                      <Button 
                        variant="primary" 
                        onClick={handleOpenModal}
                        className={styles.actionButton}
                      >
                        <i className="fas fa-plus-circle me-2"></i>
                        Add Post
                      </Button>
                      <Button 
                        variant="success" 
                        onClick={handleOpenPromoCodeModal}
                        className={styles.actionButton}
                      >
                        <i className="fas fa-tag me-2"></i>
                        Add Promo Code
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {loading ? (
              <div className={styles.loadingContainer}>
                <CircularProgress />
              </div>
            ) : (
              <>
                {selectedSection === 'posts' && (
                  <>
                    <Card className={`${styles.filterCard} mb-4`}>
                      <Card.Body>
                        <h5 className="mb-4">Advanced Filters</h5>
                        <Row className="g-3">
                          <Col lg={4} md={6}>
                            <Form.Group>
                              <Form.Control
                                type="text"
                                placeholder="Search by Name"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.filterInput}
                              />
                            </Form.Group>
                          </Col>
                          <Col lg={2} md={6}>
                            <Form.Group>
                              <Form.Control
                                type="number"
                                placeholder="Min Price"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className={styles.filterInput}
                              />
                            </Form.Group>
                          </Col>
                          <Col lg={2} md={6}>
                            <Form.Group>
                              <Form.Control
                                type="number"
                                placeholder="Max Price"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className={styles.filterInput}
                              />
                            </Form.Group>
                          </Col>
                          <Col lg={3} md={6}>
                            <Form.Select
                              value={selectedCurrency}
                              onChange={(e) => setSelectedCurrency(e.target.value)}
                              className={styles.filterInput}
                            >
                              <option value="">Select Currency</option>
                              {currencyCodes.map((code) => (
                                <option key={code} value={code}>{code}</option>
                              ))}
                            </Form.Select>
                          </Col>
                          <Col lg={1} md={12}>
                            <Form.Check
                              type="switch"
                              label="Rating"
                              checked={sortBy === 'rating'}
                              onChange={(e) => setSortBy(e.target.checked ? 'rating' : '')}
                              className={styles.filterSwitch}
                            />
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                    <Row className="g-4">
                      {sortedPosts.map((post) => (
                        <Col key={post._id} xl={3} lg={4} md={6}>
                          <Card className={styles.postCard}>
                            <div className={styles.postImageContainer}>
                              <Card.Img 
                                variant="top" 
                                src={post.imageurl} 
                                className={styles.postImage}
                              />
                              {post.archived && (
                                <div className={styles.archivedBadge}>
                                  Archived
                                </div>
                              )}
                            </div>
                            <Card.Body>
                              <Card.Title className={styles.postTitle}>{post.details}</Card.Title>
                              <div className={styles.postStats}>
                                <div className={styles.statItem}>
                                  <span className="text-muted">Price:</span>
                                  <span className="fw-bold">{post.price} {post.currency}</span>
                                </div>
                                <div className={styles.statItem}>
                                  <span className="text-muted">Quantity:</span>
                                  <span className="fw-bold">{post.quantity}</span>
                                </div>
                                <div className={styles.statItem}>
                                  <span className="text-muted">Sales:</span>
                                  <span className="fw-bold">{post.purchasedCount * post.price}</span>
                                </div>
                                <div className={styles.statItem}>
                                  <span className="text-muted">Rating:</span>
                                  <ReactStars
                                      count={5}
                                      value={post.averageRating}
                                      size={24}
                                      edit={false}
                                      isHalf={true}
                                      activeColor="#ffd700"
                                  />
                                  <span className="fw-bold ms-2">{post.averageRating}</span>
                                </div>
                              </div>
                              <Form.Check
                                  type="switch"
                                  id={`archive-switch-${post._id}`}
                                  label="Archive"
                                  checked={post.archived}
                                  onChange={(e) => handleArchiveToggle(post._id, e.target.checked)}
                                  className="mb-3"
                              />
                              <div className={styles.postActions}>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => handleEditPost(post)}
                                    className={styles.actionBtn}
                                >
                                  <i className="fas fa-edit me-1"></i> Edit
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </>
                )}
                {selectedSection === 'tags' && (
                  <div className="mt-4">
                    <Tags />
                  </div>
                )}
                {selectedSection === 'ActivityCategory' && (
                  <div className="mt-4">
                    <div>Debug: Categories Section</div>
                    <ActivityCategory />
                  </div>
                )}
              </>
            )}
          </Container>
        </div>
      </div>

      <Modal show={promoCodeModalOpen} onHide={handleClosePromoCodeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Promo Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Code</Form.Label>
              <Form.Control
                type="text"
                value={promoCodeData.code}
                onChange={(e) => setPromoCodeData({...promoCodeData, code: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Discount Percentage</Form.Label>
              <Form.Control
                type="number"
                value={promoCodeData.discountPercentage}
                onChange={(e) => setPromoCodeData({...promoCodeData, discountPercentage: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control
                type="date"
                value={promoCodeData.expiryDate}
                onChange={(e) => setPromoCodeData({...promoCodeData, expiryDate: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Activated"
                checked={promoCodeData.activated}
                onChange={(e) => setPromoCodeData({...promoCodeData, activated: e.target.checked})}
              />
            </Form.Group>
          </Form>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePromoCodeModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitPromoCode}>
            Add Promo Code
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={openModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingPostId ? 'Edit Post' : 'Add New Post'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Details</Form.Label>
              <Form.Control
                type="text"
                name="details"
                value={currentPost.details}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={currentPost.price}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Currency</Form.Label>
              <Form.Select
                name="currency"
                value={currentPost.currency}
                onChange={handleInputChange}
              >
                <option value="">Select Currency</option>
                {currencyCodes.map((code) => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={currentPost.quantity}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                onChange={handleImageChange}
              />
            </Form.Group>
          </Form>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitPost}>
            {editingPostId ? 'Update' : 'Add'} Post
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </div>
  );
}
export default Admin;