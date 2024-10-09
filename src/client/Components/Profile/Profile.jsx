import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';
import Logo from '/src/client/Assets/Img/logo.png';
import Footer from '/src/client/components/Footer/Footer';

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state;
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    role: '',
  });

  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/tourist/profile?id=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const { password, __v, _id, ...userData } = await response.json();
        setUserInfo(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleUpdateClick = () => {
    localStorage.setItem('userId', userId);
    window.location.href = '/UpdateProfile';
  };

  const handleProductViewClick = () => {
    navigate('/products');
  };

  const handlePostClick = () => {
    navigate('/create-post');
  };

  const handleAddActivity = () => {
    localStorage.setItem('userId', userId);
    navigate('/AdvertiserMain');
  };

  const handleCreateHistoricalPlaceClick = () => {
    navigate('/create-historical-place', { state: { userId } });
  };

  const handleUpdateClick2 = () => {
    navigate('/Search');
  };

  const handleViewButtonClick = () => {
    setShowButtons(prevShow => !prevShow);
  };

  const handleUpcomingActivitiesClick = () => {
    navigate('/UpcomingActivites');
  };

  const handleUpcomingItinerariesClick = () => {
    navigate('/UpcomingItineraries');
  };

  const handleViewHistoricalPlacesClick = () => {
    navigate('/historical-places', { state: { userId } });
  };

  const handleCreateHistoricalTagClick = () => {
    navigate('/historical-tags');
  };

  const handleAddItinerary = () => {
    navigate('/tourguide', { state: { userId } });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src={Logo} alt="Safarny Logo" className={styles.logo} />
        <h1>Safarny</h1>
        <nav className={styles.nav}>
          <Link to="/" className={styles.button}>Back to Home</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.intro}>
          <h1>Welcome, {userInfo.username}!</h1>
          <h5>Your account details:</h5>
          {Object.entries(userInfo).map(([key, value]) => (
            <p key={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
            </p>
          ))}
        </section>
      </main>

      <div className={styles.buttonContainer}>
        <button onClick={handleProductViewClick} className={styles.productButton}>
          View Products
        </button>
        <button onClick={handleUpdateClick2} className={styles.searchButton}>
          Search
        </button>
        <button onClick={handleUpdateClick} className={styles.searchButton}>
          Update Profile
        </button>
      </div>

      {userInfo.role === 'TourismGovernor' && (
        <>
          <button onClick={handleCreateHistoricalPlaceClick} className={styles.createPlaceButton}>
            Create Historical Place
          </button>
          <button onClick={handleCreateHistoricalTagClick} className={styles.createTagButton}>
            Create Historical Tag
          </button>
        </>
      )}

      {userInfo.role === 'Seller' && (
        <button onClick={handlePostClick} className={styles.postButton}>
          Post
        </button>
      )}

      {userInfo.role === 'Advertiser' && (
        <button onClick={handleAddActivity} className={styles.postButton}>
          Activity
        </button>
      )}

      {userInfo.role === 'TourGuide' && (
        <button onClick={handleAddItinerary} className={styles.postButton}>
          Add Itinerary
        </button>
      )}

      <button onClick={handleViewButtonClick} className={styles.mainButton}>
        View Upcoming Events
      </button>

      {showButtons && (
        <div className={styles.buttonGroup}>
          <button className={styles.subButton} onClick={handleUpcomingActivitiesClick}>
            Upcoming Activities
          </button>
          <button className={styles.subButton} onClick={handleUpcomingItinerariesClick}>
            Upcoming Itineraries
          </button>
          <button className={styles.subButton} onClick={handleViewHistoricalPlacesClick}>
            Upcoming Historical Places
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Profile;
