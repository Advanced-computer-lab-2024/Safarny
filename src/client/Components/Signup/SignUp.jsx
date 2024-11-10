import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '/src/client/Components/Footer/Footer';
import Header from '../Header/Header';
import styles from './SignUp.module.css';
import Modal from 'react-modal';
const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
  "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cape Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Democratic Republic of the Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica",
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

const countryToCurrency = {
  "Afghanistan": "AFN", "Albania": "ALL", "Algeria": "DZD", "Andorra": "EUR", "Angola": "AOA", "Antigua and Barbuda": "XCD", "Argentina": "ARS", "Armenia": "AMD", "Australia": "AUD", "Austria": "EUR",
  "Azerbaijan": "AZN", "Bahamas": "BSD", "Bahrain": "BHD", "Bangladesh": "BDT", "Barbados": "BBD", "Belarus": "BYN", "Belgium": "EUR", "Belize": "BZD", "Benin": "XOF", "Bhutan": "BTN", "Bolivia": "BOB",
  "Bosnia and Herzegovina": "BAM", "Botswana": "BWP", "Brazil": "BRL", "Brunei": "BND", "Bulgaria": "BGN", "Burkina Faso": "XOF", "Burundi": "BIF", "Cape Verde": "CVE", "Cambodia": "KHR",
  "Cameroon": "XAF", "Canada": "CAD", "Central African Republic": "XAF", "Chad": "XAF", "Chile": "CLP", "China": "CNY", "Colombia": "COP", "Comoros": "KMF", "Congo, Democratic Republic of the Congo": "CDF", "Costa Rica": "CRC", "Croatia": "HRK", "Cuba": "CUP", "Cyprus": "EUR", "Czech Republic": "CZK", "Denmark": "DKK", "Djibouti": "DJF", "Dominica": "XCD",
  "Dominican Republic": "DOP", "Ecuador": "USD", "Egypt": "EGP", "El Salvador": "USD", "Equatorial Guinea": "XAF", "Eritrea": "ERN", "Estonia": "EUR", "Eswatini": "SZL", "Ethiopia": "ETB",
  "Fiji": "FJD", "Finland": "EUR", "France": "EUR", "Gabon": "XAF", "Gambia": "GMD", "Georgia": "GEL", "Germany": "EUR", "Ghana": "GHS", "Greece": "EUR", "Grenada": "XCD", "Guatemala": "GTQ", "Guinea": "GNF",
  "Guinea-Bissau": "XOF", "Guyana": "GYD", "Haiti": "HTG", "Honduras": "HNL", "Hungary": "HUF", "Iceland": "ISK", "India": "INR", "Indonesia": "IDR", "Iran": "IRR", "Iraq": "IQD", "Ireland": "EUR", "Occupied Palestine": "ILS",
  "Italy": "EUR", "Jamaica": "JMD", "Japan": "JPY", "Jordan": "JOD", "Kazakhstan": "KZT", "Kenya": "KES", "Kiribati": "AUD", "Korea, North": "KPW", "Korea, South": "KRW", "Kosovo": "EUR", "Kuwait": "KWD",
  "Kyrgyzstan": "KGS", "Laos": "LAK", "Latvia": "EUR", "Lebanon": "LBP", "Lesotho": "LSL", "Liberia": "LRD", "Libya": "LYD", "Liechtenstein": "CHF", "Lithuania": "EUR", "Luxembourg": "EUR", "Madagascar": "MGA",
  "Malawi": "MWK", "Malaysia": "MYR", "Maldives": "MVR", "Mali": "XOF", "Malta": "EUR", "Marshall Islands": "USD", "Mauritania": "MRU", "Mauritius": "MUR", "Mexico": "MXN", "Micronesia": "USD", "Moldova": "MDL",
  "Monaco": "EUR", "Mongolia": "MNT", "Montenegro": "EUR", "Morocco": "MAD", "Mozambique": "MZN", "Myanmar": "MMK", "Namibia": "NAD", "Nauru": "AUD", "Nepal": "NPR", "Netherlands": "EUR", "New Zealand": "NZD",
  "Nicaragua": "NIO", "Niger": "XOF", "Nigeria": "NGN", "North Macedonia": "MKD", "Norway": "NOK", "Oman": "OMR", "Pakistan": "PKR", "Palau": "USD", "Palestine": "ILS", "Panama": "PAB", "Papua New Guinea": "PGK",
  "Paraguay": "PYG", "Peru": "PEN", "Philippines": "PHP", "Poland": "PLN", "Portugal": "EUR", "Qatar": "QAR", "Romania": "RON", "Russia": "RUB", "Rwanda": "RWF", "Saint Kitts and Nevis": "XCD", "Saint Lucia": "XCD",
  "Saint Vincent and the Grenadines": "XCD", "Samoa": "WST", "San Marino": "EUR", "Sao Tome and Principe": "STN", "Saudi Arabia": "SAR", "Senegal": "XOF", "Serbia": "RSD", "Seychelles": "SCR",
  "Sierra Leone": "SLL", "Singapore": "SGD", "Slovakia": "EUR", "Slovenia": "EUR", "Solomon Islands": "SBD", "Somalia": "SOS", "South Africa": "ZAR", "South Sudan": "SSP", "Spain": "EUR", "Sri Lanka": "LKR",
  "Sudan": "SDG", "Suriname": "SRD", "Sweden": "SEK", "Switzerland": "CHF", "Syria": "SYP", "Taiwan": "TWD", "Tajikistan": "TJS", "Tanzania": "TZS", "Thailand": "THB", "Timor-Leste": "USD", "Togo": "XOF", "Tonga": "TOP",
  "Trinidad and Tobago": "TTD", "Tunisia": "TND", "Turkey": "TRY", "Turkmenistan": "TMT", "Tuvalu": "AUD", "Uganda": "UGX", "Ukraine": "UAH", "United Arab Emirates": "AED", "United Kingdom": "GBP",
  "United States": "USD", "Uruguay": "UYU", "Uzbekistan": "UZS", "Vanuatu": "VUV", "Vatican City": "EUR", "Venezuela": "VES", "Vietnam": "VND", "Yemen": "YER", "Zambia": "ZMW", "Zimbabwe": "ZWL"
};

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
  const [walletCurrency, setWalletCurrency] = useState('');
  const age = DOB ? calculateAge(DOB) : null;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
      setWalletCurrency(savedData.walletCurrency || '');
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
      termsAccepted,
      walletCurrency
    };
    localStorage.setItem('signUpFormData', JSON.stringify(formData));
  }, [username, email, password, mobile, nationality, employed, DOB, termsAccepted, walletCurrency]);

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

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setNationality(selectedCountry);
    setWalletCurrency(countryToCurrency[selectedCountry] || '');
  };

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
      age,
      walletCurrency
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
      termsAccepted,
      walletCurrency
    };
    navigate(path);
  };

  return (
      <div className={styles.container}>
        <Header />
        <div className={styles.formContainer}>
          <h2 className={styles.heading}>Sign Up</h2>
          {success && <p className={styles.successMessage}>Sign up successful!</p>}
          {error && <p className={styles.errorMessage}>{error}</p>}
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>
              Name:
              <input className={styles.input}
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  required
              />
            </label>
            <label className={styles.label}>
              Email:
              <input className={styles.input}
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
            </label>
            <label className={styles.label}>
              Password:
              <input className={styles.input}
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
            </label>
            <label className={styles.label}>
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
            <label className={styles.label}>
              Mobile:
              <input className={styles.input}
                  type="text"
                  name="mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
              />
            </label>
            <label className={styles.label}>
              Nationality:
              <select className={styles.input}
                  value={nationality}
                  onChange={handleCountryChange}
                  required
              >
                <option value="">Select Country of Origin</option>
                {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </label>
            <label className={styles.label}>
              Employment Status:
              <select className={styles.input}
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
              <input className={styles.input}
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  required
              />
              <label htmlFor="terms" className={styles.label}>
                I agree to the following terms and conditions:
              </label>
              <div className={styles.termsText}>
                <ul>
                  <p>
                  <span onClick={openModal}
                        style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline'}}>
                    Click here for the terms and conditions.
                  </span>
                  </p>
                </ul>
              </div>
            </div>
            <button type="submit" className={styles.submitButton}>Sign Up</button>
          </form>
        </div>
        <Footer/>
        <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Terms and Conditions"
            className={styles.modal}
            overlayClassName={styles.overlay}
        >
          <div className={styles.container}>
            <Header />
            <main style={{ flexGrow: 1 }}>
              <h2>Terms and Conditions</h2>
              <p>Please read the following terms and conditions carefully:</p>
              <ul>
                <li>Your use of this site signifies your acceptance of our terms.</li>
                <li>Personal information you provide will be treated as per our privacy policy.</li>
                <li>Unauthorized access or misuse of our services is strictly prohibited.</li>
                <li>We reserve the right to modify these terms at any time without notice.</li>
              </ul>
              <p>Thank you for using our platform responsibly.</p>
            </main>
            <Footer />
          </div>
        </Modal>
      </div>
  );
};

export default SignUp;