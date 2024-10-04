import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '/src/client/components/Footer/Footer';
import Logo from '/src/client/Assets/Img/logo.png';
import styles from './UpdateProfile.module.css';
import { Link, useLocation } from 'react-router-dom';

const UpdateProfile = () => {
  const userId = localStorage.getItem('userId');
console.log(userId);

  const location = useLocation();
  
  // State variables to hold user information
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
    nationality: '',
    mobile: '',
    employed: '',
    type: '',
    age: '',
    YearOfExp: '',
    PrevWork: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch current user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/tourist/${userId}`);
        setUserInfo(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setErrorMessage('Error fetching user data.');
      }
    };

    fetchUserData();
  }, [userId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:3000/tourist/${userId}`, userInfo);
      setSuccessMessage(response.data.message);
      setErrorMessage('');
    } catch (error) {
      console.error('Error updating user data:', error);
      setErrorMessage(error.response ? error.response.data.error : 'An unexpected error occurred.');
      setSuccessMessage('');
    }
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
        <h2>Update Your Profile</h2>

        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Email:
            <input
              type="email"
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={userInfo.password}
              onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
              required
            />
          </label>
          <label>
            Nationality:
            <input
              type="text"
              value={userInfo.nationality}
              onChange={(e) => setUserInfo({ ...userInfo, nationality: e.target.value })}
              required
            />
          </label>
          <label>
            Mobile:
            <input
              type="text"
              value={userInfo.mobile}
              onChange={(e) => setUserInfo({ ...userInfo, mobile: e.target.value })}
              required
            />
          </label>
          <label>
            Employed:
            <input
              type="text"
              value={userInfo.employed}
              onChange={(e) => setUserInfo({ ...userInfo, employed: e.target.value })}
              required
            />
          </label>
          <label>
            Type:
            <input
              type="text"
              value={userInfo.role}
              onChange={(e) => setUserInfo({ ...userInfo, type: e.target.value })}
              required
            />
          </label>
          <label>
            Age:
            <input
              type="number"
              value={userInfo.age}
              onChange={(e) => setUserInfo({ ...userInfo, age: e.target.value })}
              required
            />
          </label>
          <label>
            Years of Experience:
            <input
              type="number"
              value={userInfo.YearOfExp}
              onChange={(e) => setUserInfo({ ...userInfo, YearOfExp: e.target.value })}
              required
            />
          </label>
          <label>
            Previous Work:
            <input
              type="text"
              value={userInfo.PrevWork}
              onChange={(e) => setUserInfo({ ...userInfo, PrevWork: e.target.value })}
              required
            />
          </label>

          <button type="submit" className={styles.button}>
            Update Profile
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default UpdateProfile;
