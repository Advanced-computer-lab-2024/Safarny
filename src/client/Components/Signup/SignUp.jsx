import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '/src/client/Components/Footer/Footer';  
import Logo from '/src/client/Assets/Img/logo.png';
import styles from './SignUp.module.css';  

const SignUp = () => {
  // Form state management
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [nationality, setNationality] = useState('');
  const [employed, setEmployed] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const type = "tourist";  // Assuming default user type is 'tourist'
  const [DOB, setDob] = useState('');
  const age = calculateAge(DOB);


  function calculateAge(dob) {
    const dobDate = new Date(dob);
    const today = new Date();
    
    let age = today.getFullYear() - dobDate.getFullYear();
    
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
  
    return age;
  }

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      username,
      email,
      password,
      mobile,
      nationality,
      employed,
      type,
      age
    };

    try {
      const response = await axios.post('http://localhost:3000/signup', userData);
      if (response.status === 201) {
        setSuccess(true);
        setError('');
        navigate('/signin');  // Redirect to SignIn after successful signup
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
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
        <h2>Sign Up</h2>
        {success && <p className={styles.successMessage}>Sign up successful!</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}

        {/* Form structure with state handlers */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Name:
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </label>
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
          <label htmlFor="dob">Date of Birth:</label>
          <DatePicker
            selected={DOB}
            onChange={(date) => setDob(date)}
            dateFormat="MM/dd/yyyy"
            className="form-control"
            placeholderText="Select your date of birth"
          />
          <label>
            Mobile:
            <input
              type="text"
              name="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </label>
          <label>
            Nationality:
            <select
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              required
            >
              <option value="">Select Country of Origin</option>
              <option value="Egypt">Egypt</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
            </select>
          </label>
          <label>
            Employment Status:
            <select
              value={employed}
              onChange={(e) => setEmployed(e.target.value)}
              required
            >
              <option value="">Select employment status</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>

          <button type="submit" className={styles.button}>
            Sign Up
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default SignUp;
