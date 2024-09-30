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

    // Payload to send
    const userData = { email, password };

    try {
      // Send the request to the backend
      const response = await axios.post('http://localhost:3000/login', userData);

      if (response.status === 200) {
        setSuccess(true);
        setError('');
        // Redirect based on the user type received from the backend
        const userId = response.data.id; // Ensure the ID is correctly extracted
        if (response.data.type === 'Tourist') {
          navigate('/Profile', { state: { userId } });
        } else if (response.data.type === 'Seller') {
          navigate('/Profile', { state: { userId } });
        } else if (response.data.type === 'Admin') {
          navigate('/Profile', { state: { userId } });
        }
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);  // Backend error (e.g., invalid credentials)
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