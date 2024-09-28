import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Profile.module.css';
import Logo from '/src/client/Assets/Img/logo.png';
import Footer from '/src/client/components/Footer/Footer';

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
  });

  useEffect(() => {
    // Simulate fetching user data
    const fetchUserData = () => {
      const userData = {
        username: 'Bro',
        email: 'john.doe@example.com',
      };
      setUserInfo(userData);
    };

    fetchUserData();
  }, []);

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
          <p>Email: {userInfo.email}</p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
