import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Footer from "/src/client/Components/Footer/Footer";
import Header from "/src/client/Components/Header/Header";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../server/config/Firebase"; // Adjust the path as necessary
import styles from "/src/client/Components/SignupExtra/SignUpExtra.module.css"; // Import your signup styles
import { uploadBytes } from 'firebase/storage';
import Modal from 'react-modal';

// List of countries for nationality dropdown
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

// Add the countryToCurrency mapping
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

const SignUpExtra = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Image upload state
  const [imageFile, setImageFile] = useState(null);

  // Additional state variables for the input fields based on user type
  const [websiteLink, setWebsiteLink] = useState("");
  const [hotline, setHotline] = useState("");
  const [companyProfile, setCompanyProfile] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [description, setDescription] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [experience, setExperience] = useState("");
  const [previousWork, setPreviousWork] = useState("");
  const [nationality, setNationality] = useState(""); // New state for nationality
  const [walletCurrency, setWalletCurrency] = useState(""); // New state for wallet currency
  const [textBoxes, setTextBoxes] = useState(new Array(3).fill(false));
  const [idFile, setIdFile] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);
  const [taxCardFile, setTaxCardFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for Terms and Conditions
  const [termsAccepted, setTermsAccepted] = useState(false);

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

  const [showPasswordRequirements, setShowPasswordRequirements] = useState(true); // Always show requirements

  const navigate = useNavigate();

  const handleFileChange = (setter) => (e) => setter(e.target.files[0]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const uploadFile = async (file, path) => {
    if (!file) return null;
    
    try {
      const storageRef = ref(storage, path);
      const uploadResult = await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);
      return downloadURL;
    } catch (error) {
      console.error("File upload error:", error);
      throw new Error(`Failed to upload ${path}`);
    }
  };

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => reject(error),
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
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
    
    try {
      // Check password strength
      const strengthScore = checkPasswordStrength(password);
      if (strengthScore < 3) {
        setError("Please create a stronger password that meets the requirements.");
        return;
      }

      // Check if terms are accepted
      if (!termsAccepted) {
        setError("Please accept the terms and conditions to proceed.");
        return;
      }

      // Validate required fields based on user type
      if (!username || !password || !email || !userType || !mobileNumber || !nationality) {
        setError("Please fill in all required fields");
        return;
      }

      // Set wallet currency based on nationality
      const currency = countryToCurrency[nationality] || 'USD';

      // Upload files first
      let uploadedFiles = {};
      
      try {
        if (idFile) {
          const idUrl = await uploadFile(idFile, `documents/${username}/id`);
          uploadedFiles.idPhoto = idUrl;
        }

        if (certificateFile) {
          const certUrl = await uploadFile(certificateFile, `documents/${username}/certificate`);
          uploadedFiles.certificate = certUrl;
        }

        if (userType === "Seller" && taxCardFile) {
          const taxUrl = await uploadFile(taxCardFile, `documents/${username}/taxCard`);
          uploadedFiles.taxCard = taxUrl;
        }
      } catch (uploadError) {
        console.error("File upload error:", uploadError);
        setError("Error uploading files. Please try again.");
        return;
      }

      // Prepare the registration data
      const registrationData = {
        username: username.trim(),
        password,
        email: email.trim(),
        role: userType,
        image: null,
        CompanyLink: websiteLink?.trim() || "",
        CompanyHotline: hotline?.trim() || "",
        CompanyName: companyProfile?.trim() || "",
        sellerName: sellerName?.trim() || "",
        description: description?.trim() || "",
        mobile: mobileNumber.trim(),
        YearOfExp: experience?.trim() || "",
        PrevWork: previousWork?.trim() || "",
        nationality,
        walletCurrency: currency,
        ...uploadedFiles // Spread the uploaded file URLs
      };

      console.log("Sending registration data:", registrationData); // Debug log

      // Send registration request
      const response = await axios.post("/guest/others-signup", registrationData);

      if (response.data.success) {
        setSuccess(true);
        setError("");
        navigate("/signin");
      } else {
        setError(response.data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response) {
        console.error("Server response:", error.response.data); // Debug log
        setError(error.response.data.message || "Registration failed. Please check your information and try again.");
      } else {
        setError("An error occurred during registration. Please try again.");
      }
    }
  };

  const handleUserTypeChange = (value) => {
    setUserType(value);
    showTextBoxes(value === "Advertiser" ? 0 : value === "Seller" ? 1 : 2);
  };

  const showTextBoxes = (index) => {
    const textboxes = [...textBoxes];
    textboxes.fill(false);
    textboxes[index] = true;
    setTextBoxes(textboxes);
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setNationality(selectedCountry);
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h1 className={styles.heading}>Professional Registration</h1>
          
          {success && <div className={styles.alert + " " + styles.success}>Registration successful!</div>}
          {error && <div className={styles.alert + " " + styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Basic Information Section */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Basic Information</h2>
              <div className={styles.sectionContent}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Username</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Email</label>
                  <input
                    className={styles.input}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Password</label>
                  <input
                    className={styles.input}
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      checkPasswordStrength(e.target.value);
                    }}
                    onFocus={() => setShowPasswordRequirements(true)}
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
                        {passwordStrength.requirements.special ? "✓" : "○"} One special character (!@#$%^&*(),.?&quot;:{}|&lt;&gt;)
                      </li>
                    </ul>
                    {password && (
                      <div className={styles.strengthIndicator}>
                        <div 
                          className={`${styles.strengthBar} ${styles[getStrengthClass(passwordStrength.score)]}`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Details Section */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Professional Details</h2>
              <div className={styles.sectionContent}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>User Type</label>
                  <select
                    className={styles.input}
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    required
                  >
                    <option value="">Select user type</option>
                    <option value="Seller">Seller</option>
                    <option value="TourGuide">Tour Guide</option>
                    <option value="Advertiser">Advertiser</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Mobile Number</label>
                  <input
                    className={styles.input}
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Nationality</label>
                  <select
                    className={styles.input}
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    required
                  >
                    <option value="">Select nationality</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Required Documents</h2>
              <div className={styles.sectionContent}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>ID Photo</label>
                  <input
                    className={styles.fileInput}
                    type="file"
                    onChange={handleFileChange(setIdFile)}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Certificate</label>
                  <input
                    className={styles.fileInput}
                    type="file"
                    onChange={handleFileChange(setCertificateFile)}
                    required
                  />
                </div>

                {userType === "Seller" && (
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Tax Card</label>
                    <input
                      className={styles.fileInput}
                      type="file"
                      onChange={handleFileChange(setTaxCardFile)}
                      required
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Terms and Submit */}
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
              <span onClick={openModal} className={styles.termsText}>
                Click here to read the terms and conditions
              </span>
            </div>

            <button type="submit" className={styles.submitButton}>
              Register
            </button>
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

export default SignUpExtra;
