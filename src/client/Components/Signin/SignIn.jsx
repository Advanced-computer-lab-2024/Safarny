import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '/src/client/Components/Footer/Footer';
import Header from '../Header/Header';
import styles from './SignIn.module.css';
import { FcGoogle } from 'react-icons/fc';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      try {
        // First check if user exists
        const checkUserResponse = await axios.get(`http://localhost:3000/guest/check-user/${result.user.email}`);
        
        if (!checkUserResponse.data.exists) {
          // If user doesn't exist, redirect to signup
          navigate('/signup');
          return;
        }

        // If user exists, proceed with Google login
        const response = await axios.post('http://localhost:3000/guest/google-login', {
          email: result.user.email,
          googleId: result.user.uid,
        });

        const { type, Status, id } = response.data;
        const userId = id;

        if (type === 'admin' || type === 'Admin') {
          setSuccess(true);
          setError('');
          navigate('/admin', { state: { userId } });
          return;
        }

        if (type === 'Tourist') {
          setSuccess(true);
          setError('');
          navigate('/Profile', { state: { userId } });
          return;
        }

        if (Status !== 'Accepted') {
          setError('Your account is not accepted yet. Please wait for approval.');
          setSuccess(false);
          return;
        }

        setSuccess(true);
        setError('');
        if (['Seller', 'TourGuide', 'Advertiser', 'TourismGovernor'].includes(type)) {
          navigate('/Profile', { state: { userId } });
        }
      } catch (err) {
        if (err.response?.status === 404) {
          // User doesn't exist, redirect to signup
          navigate('/signup');
        } else {
          setError(err.response?.data?.message || 'An unexpected error occurred');
          console.error('Backend error details:', err.response?.data);
        }
        setSuccess(false);
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      setError('Failed to sign in with Google');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { email, password };

    try {
      const response = await axios.post('http://localhost:3000/guest/login', userData);

      // Assuming 'type', 'status', and 'id' are part of the response data
      const { type, Status, id } = response.data;
      const userId = id;

      // If the user is 'admin', sign in without checking status
      if (type === 'admin' || type === 'Admin') {
        setSuccess(true);
        setError('');
        console.log('id1', userId);
        navigate('/admin', { state: { userId } }); // Pass userId to Admin page
        return; // Stop further execution for admin
      }

      if (type === 'Tourist') {
        setSuccess(true);
        setError('');
        navigate('/Profile', { state: { userId } });
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
      // Assuming `id` is the user identifier in the response
      if (['Seller', 'TourGuide', 'Advertiser', 'TourismGovernor'].includes(type)) {
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
    <div className={styles.pageWrapper}>
      <Header />
      
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h1 className={styles.heading}>Welcome Back</h1>
          
          {success && <div className={styles.alert + " " + styles.success}>Sign in successful!</div>}
          {error && <div className={styles.alert + " " + styles.error}>{error}</div>}

          <button 
            className={styles.googleButton}
            onClick={handleGoogleSignIn}
          >
            <FcGoogle size={20} />
            Sign in with Google
          </button>
          
          <div className={styles.divider}>
            <span>or sign in with email</span>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                type="password"
                id="password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              Sign In
            </button>

            <div className={styles.links}>
              <Link to="/password-recovery" className={styles.forgotPassword}>
                Forgot Password?
              </Link>
              <Link to="/signup" className={styles.createAccount}>
                Create an account
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SignIn;
