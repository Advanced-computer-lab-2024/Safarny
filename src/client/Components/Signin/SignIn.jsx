import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '/src/client/Components/Footer/Footer';
import Logo from '/src/client/Assets/Img/logo.png';
import styles from './SignIn.module.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const userData = { email, password };
  
    try {
      const response = await axios.post('http://localhost:3000/guest/login', userData);
  
      // Assuming 'type', 'status', and 'id' are part of the response data
      const { type, Status, id } = response.data;
  
      // If the user is 'admin', sign in without checking status
      if (type === 'admin' || type === 'Admin') {
        setSuccess(true);
        setError('');
        navigate('/admin');
        return; // Stop further execution for admin
      }
  
      // For non-admin users, check if the account is accepted
      if (Status !== 'Accepted') {
        setError('Your account is not accepted yet. Please wait for approval.');
        setSuccess(false);
        return; // Stop further execution if the account is not accepted
      }
  
      // If account is accepted, proceed to the profile
      setSuccess(true);
      setError('');
      const userId = id; // Assuming `id` is the user identifier in the response
      if (['Tourist', 'Seller', 'TourGuide', 'Advertiser'].includes(type)) {
        navigate('/Profile', { state: { userId } });
      }
  
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setSuccess(false);
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

      <div className={styles.formContainer}>
        <h2>Sign In</h2>

        {/* Show success or error messages */}
        {success && <p className={styles.successMessage}>Sign in successful!</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}

        {/* Form structure with state handlers */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" className={styles.button}>
            Sign In
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default SignIn;