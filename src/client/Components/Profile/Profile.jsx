import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';
import Logo from '/src/client/Assets/Img/logo.png';
import Footer from '/src/client/components/Footer/Footer';
import UpdateProfilePage from '/src/client/Components/UpdateProfile/UpdateProfile';

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook for navigation
  const { userId } = location.state; // Get the user ID from the state
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/tourist/profile?id=${userId}`); // Use the ID from the state

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const { password, __v, _id, ...userData } = await response.json(); // Exclude the password, _v, and id fields
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
    navigate('/products'); // Navigate to the product list page
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

      <button onClick={handleUpdateClick} className={styles.updateButton}>
        Update Profile
      </button>

      {/* Button to view products */}
      <button onClick={handleProductViewClick} className={styles.productButton}>
        View Products
      </button>

      <Footer />
    </div>
  );
};

export default Profile;
