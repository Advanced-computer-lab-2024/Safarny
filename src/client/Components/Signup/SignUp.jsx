import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '/src/client/Components/Footer/Footer';
import Header from '../Header/Header';
import styles from './SignUp.module.css';

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
  "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cape Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica",
  "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
  "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Occupied Palestine",
  "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait",
  "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
  "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova",
  "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand",
  "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea",
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
  "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
  "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka",
  "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga",
  "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
  "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const SignUp = () => {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [nationality, setNationality] = useState('');
  const [employed, setEmployed] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [DOB, setDob] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const age = DOB ? calculateAge(DOB) : null;

  const navigate = useNavigate();

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('signUpFormData'));
    if (savedData) {
      setUserName(savedData.username || '');
      setEmail(savedData.email || '');
      setPassword(savedData.password || '');
      setMobile(savedData.mobile || '');
      setNationality(savedData.nationality || '');
      setEmployed(savedData.employed || '');
      setDob(savedData.DOB ? new Date(savedData.DOB) : null);
      setTermsAccepted(savedData.termsAccepted || false);
    }
  }, []);

  useEffect(() => {
    const formData = {
      username,
      email,
      password,
      mobile,
      nationality,
      employed,
      DOB,
      termsAccepted
    };
    localStorage.setItem('signUpFormData', JSON.stringify(formData));
  }, [username, email, password, mobile, nationality, employed, DOB, termsAccepted]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!termsAccepted) {
      setError('You must accept the terms and conditions to sign up.');
      return;
    }

    const userData = {
      username,
      email,
      password,
      mobile,
      nationality,
      employed,
      DOB,
      age
    };

    try {
      const response = await axios.post('http://localhost:3000/guest/tourist-signup', userData);
      if (response.status === 201) {
        setSuccess(true);
        setError('');
        localStorage.removeItem('signUpFormData');
        navigate('/signin');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      setSuccess(false);
    }
  };

  const handleNavigate = (path) => {
    const formData = {
      username,
      email,
      password,
      mobile,
      nationality,
      employed,
      DOB,
      termsAccepted
    };
    localStorage.setItem('signUpFormData', JSON.stringify(formData));
    navigate(path);
  };
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.formContainer}>
        <h2>Sign Up</h2>
        {success && <p className={styles.successMessage}>Sign up successful!</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}
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
          <label>
            Date of Birth:
            <DatePicker
              selected={DOB}
              onChange={(date) => setDob(date)}
              dateFormat="MM/dd/yyyy"
              className="form-control"
              placeholderText="Select your date of birth"
              required
            />
          </label>
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
              {countries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
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
          <div className={styles.terms}>
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              required
            />
            <label htmlFor="terms">
              I agree to the following terms and conditions:
            </label>
            <div className={styles.termsText}>
              <ul>
                <p>
                  <span onClick={() => handleNavigate('/terms')} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                    Click here for the terms and conditions.
                  </span>
                </p>
              </ul>
            </div>
          </div>
          <button type="submit" className={styles.submitButton}>Sign Up</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;