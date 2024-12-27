import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '/src/client/Components/Footer/Footer';
import Header from '../Header/Header';
import styles from './SignUp.module.css';
import Modal from 'react-modal';
import { storage } from '../../../server/config/Firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { FcGoogle } from 'react-icons/fc';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

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
  const [walletcurrency, setWalletcurrency] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState('');
  const age = DOB ? calculateAge(DOB) : null;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false
    }
  });

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
      setWalletcurrency(savedData.walletcurrency || '');
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
      walletcurrency,
      photoURL
    };
    localStorage.setItem('signUpFormData', JSON.stringify(formData));
  }, [username, email, password, mobile, nationality, employed, DOB, termsAccepted, walletcurrency, photoURL]);

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
    setWalletcurrency(countryToCurrency[selectedCountry] || '');
  };

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handlePhotoUpload = async () => {
    if (!photo) return;

    const storageRef = ref(storage, `photos/${photo.name}`);
    const uploadTask = uploadBytesResumable(storageRef, photo);

    return new Promise((resolve, reject) => {
      uploadTask.on(
          'state_changed',
          (snapshot) => {},
          (error) => {
            console.error('Photo upload error:', error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setPhotoURL(downloadURL);
            resolve(downloadURL);
          }
      );
    });
  };

  const checkPasswordStrength = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    let score = Object.values(requirements).filter(Boolean).length;
    
    setPasswordStrength({
      score,
      requirements
    });

    return score;
  };

  const getStrengthClass = (score) => {
    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const strengthScore = checkPasswordStrength(password);
    if (strengthScore < 3) {
      setError("Please create a stronger password that meets the requirements.");
      return;
    }

    if (!termsAccepted) {
      setError('You must accept the terms and conditions to sign up.');
      return;
    }

    try {
      const photoURL = await handlePhotoUpload();

      const userData = {
        username,
        email,
        password,
        mobile,
        nationality,
        employed,
        DOB,
        age,
        walletcurrency,
        photo: photoURL
      };

      const response = await axios.post('http://localhost:3000/guest/tourist-signup', userData);
      if (response.status === 201) {
        setSuccess(true);
        setError('');
        localStorage.removeItem('signUpFormData');
        navigate('/signin');
      }
    } catch (err) {
      console.log(err);
      setError('Registration failed. Please try again.');
      setSuccess(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const userData = {
        email: result.user.email,
        username: result.user.displayName,
        nationality: 'Not Specified',
        walletcurrency: 'USD',
        mobile: '0',
        DOB: new Date(),
        employed: 'No',
        photo: result.user.photoURL,
        role: "Tourist",
        password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
      };

      try {
        const response = await axios.post('/signup', userData, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const userId = response.data.data.user._id;
        if (response.data.token) {
          setSuccess(true);
          setError('');
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.data.user));
          setTimeout(() => {
            navigate('/Profile', { state: { userId } });
          }, 1500);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Error creating account';
        console.error('Backend error details:', err.response?.data);
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      setError('Failed to sign in with Google');
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h1 className={styles.heading}>Create Account</h1>
          
          <button 
            className={styles.googleButton}
            onClick={handleGoogleSignUp}
          >
            <FcGoogle size={20} />
            Sign up with Google
          </button>
          
          <div className={styles.divider}>
            <span>or sign up with email</span>
          </div>
          
          {success && <div className={styles.alert + " " + styles.success}>Sign up successful!</div>}
          {error && <div className={styles.alert + " " + styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Personal Information Section */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Personal Information</h2>
              <div className={styles.sectionContent}>
                <div className={styles.inputGroup}>
                  <label htmlFor="username">Name</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    placeholder="Enter your name"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="dob">Date of Birth</label>
                  <DatePicker
                    id="dob"
                    selected={DOB}
                    onChange={(date) => setDob(date)}
                    placeholderText="Select your date of birth"
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="nationality">Nationality</label>
                  <select
                    id="nationality"
                    value={nationality}
                    onChange={handleCountryChange}
                    required
                  >
                    <option value="">Select Country of Origin</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Account Information Section */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Account Details</h2>
              <div className={styles.sectionContent}>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      checkPasswordStrength(e.target.value);
                    }}
                    required
                    placeholder="Enter your password"
                  />
                  <div className={styles.passwordRequirements}>
                    <p className={styles.requirementsTitle}>Password must contain:</p>
                    <ul className={styles.requirementList}>
                      <li className={`${styles.requirementItem} ${passwordStrength.requirements.length ? styles.valid : styles.invalid}`}>
                        {passwordStrength.requirements.length ? "✓" : "○"} At least 8 characters
                      </li>
                      <li className={`${styles.requirementItem} ${passwordStrength.requirements.uppercase ? styles.valid : styles.invalid}`}>
                        {passwordStrength.requirements.uppercase ? "✓" : "○"} One uppercase letter
                      </li>
                      <li className={`${styles.requirementItem} ${passwordStrength.requirements.lowercase ? styles.valid : styles.invalid}`}>
                        {passwordStrength.requirements.lowercase ? "✓" : "○"} One lowercase letter
                      </li>
                      <li className={`${styles.requirementItem} ${passwordStrength.requirements.number ? styles.valid : styles.invalid}`}>
                        {passwordStrength.requirements.number ? "✓" : "○"} One number
                      </li>
                      <li className={`${styles.requirementItem} ${passwordStrength.requirements.special ? styles.valid : styles.invalid}`}>
                        {passwordStrength.requirements.special ? "✓" : "○"} One special character (!@#$%^&*(),.?":{}|)
                      </li>
                    </ul>
                    {password && (
                      <div className={styles.strengthIndicator}>
                        <div className={`${styles.strengthBar} ${styles[getStrengthClass(passwordStrength.score)]}`} />
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="mobile">Mobile</label>
                  <input
                    type="tel"
                    id="mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                    placeholder="Enter your mobile number"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Additional Information</h2>
              <div className={styles.sectionContent}>
                <div className={styles.inputGroup}>
                  <label htmlFor="employed">Employment Status</label>
                  <select
                    id="employed"
                    value={employed}
                    onChange={(e) => setEmployed(e.target.value)}
                    required
                  >
                    <option value="">Select employment status</option>
                    <option value="Yes">Employed</option>
                    <option value="No">Not Employed</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="photo">Profile Photo</label>
                  <input
                    type="file"
                    id="photo"
                    onChange={handlePhotoChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className={styles.terms}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  required
                />
                I agree to the terms and conditions
              </label>
              <div className={styles.termsText}>
                <span onClick={openModal}>Click here to read the terms and conditions</span>
              </div>
            </div>

            <button type="submit" className={styles.submitButton}>
              Create Account
            </button>

            <div className={styles.links}>
              <Link to="/signin" className={styles.createAccount}>
                Already have an account? Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Terms and Conditions"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <div className={styles.modalContent}>
          <h2>Terms and Conditions</h2>
          <div className={styles.modalBody}>
            <p>Please read the following terms and conditions carefully:</p>
            <ul>
              <li>Your use of this site signifies your acceptance of our terms.</li>
              <li>Personal information you provide will be treated as per our privacy policy.</li>
              <li>Unauthorized access or misuse of our services is strictly prohibited.</li>
              <li>We reserve the right to modify these terms at any time without notice.</li>
            </ul>
          </div>
          <button onClick={closeModal} className={styles.modalButton}>
            Close
          </button>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default SignUp;