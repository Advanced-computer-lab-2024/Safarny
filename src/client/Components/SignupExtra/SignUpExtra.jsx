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

  const uploadFile = async (file, filePath) => {
    const fileRef = ref(storage, filePath);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if terms are accepted
    if (!termsAccepted) {
      setError("Please accept the terms and conditions to proceed.");
      return;
    }

    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    if (idFile)   await uploadFile(idFile, `${userType}/ID_${email}`);
    console.log("about to fail")
    if (certificateFile) await uploadFile(certificateFile, `${userType}/Certificate_${email}`);
    if (taxCardFile) await uploadFile(taxCardFile, `${userType}/TaxCard_${email}`);
    console.log('about to work');

    try {
      const userData = {
        username,
        password,
        email,
        role: userType,
        image: imageUrl, // Include image URL in the user data
        CompanyLink: websiteLink,
        CompanyHotline: hotline,
        CompanyName: companyProfile,
        sellerName,
        description,
        mobile: mobileNumber,
        YearOfExp: experience,
        PrevWork: previousWork,
        nationality, // Include nationality in the user data
        walletCurrency // Include wallet currency in the user data
      };

      console.log('Submitting user data:', userData); // Log the user data

      const response = await axios.post("/guest/others-signup", userData);
      if (response.status === 201) {
        setSuccess(true);
        setError("");
        navigate("/signin");
      }
    } catch (err) {
      console.error("Registration failed:", err); // Log the error
      if (err.response && err.response.status === 400) {
        if (err.response.data.message === "Email already exists") {
          setError("Email already exists. Please use a different email.");
        } else if (err.response.data.message === "Username already exists") {
          setError("Username already exists. Please choose a different username.");
        } else {
          setError("Registration failed. Please try again.");
        }
      } else {
        setError("Registration failed. Please try again.");
      }
      setSuccess(false);
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
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className={styles.formContainer}>
              <h2 className={`${styles.heading} text-center mb-4`}>Sign Up Extra</h2>
              {success && <div className={`${styles.successMessage} alert alert-success`}>Sign up successful!</div>}
              {error && <div className={`${styles.errorMessage} alert alert-danger`}>{error}</div>}
              
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className="mb-3">
                  <label className={`${styles.label} form-label`}>
                    Username:
                    <input className={`${styles.input} form-control`}
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </label>
                </div>

                <div className="mb-3">
                  <label className={`${styles.label} form-label`}>
                    Password:
                    <input className={`${styles.input} form-control`}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </label>
                </div>

                <div className="mb-3">
                  <label className={`${styles.label} form-label`}>
                    Email:
                    <input className={`${styles.input} form-control`}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </label>
                </div>

                <div className="mb-3">
                  <label className={`${styles.label} form-label`}>
                    Nationality:
                    <select className={`${styles.input} form-select`}
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
                </div>

                <div className="mb-3">
                  <label className={`${styles.label} form-label`}>
                    I am a:
                    <select className={`${styles.input} form-select`}
                      value={userType}
                      onChange={(e) => handleUserTypeChange(e.target.value)}
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="TourGuide">Tour Guide</option>
                      <option value="Advertiser">Advertiser</option>
                      <option value="Seller">Seller</option>
                    </select>
                  </label>
                </div>

                {userType && (
                    <div className="mb-3">
                      <label className={`${styles.label} form-label`}>
                        Upload Image:
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="form-control" required/>
                      </label>
                    </div>
                )}

                {userType == "TourGuide" && (
                    <div className="mb-3">
                      <label className={`${styles.label} form-label`}>
                        Upload Id File:
                        <input type="file" accept="pdf" onChange={handleFileChange(setIdFile)} className="form-control" required/>
                      </label>
                    </div>
                )}

                {userType == "TourGuide" && (
                    <div className="mb-3">
                      <label className={`${styles.label} form-label`}>
                        Upload Certificate:
                        <input type="file" accept="pdf" onChange={handleFileChange(setCertificateFile)} className="form-control" required/>
                      </label>
                    </div>
                )}

                {(userType == "Advertiser" || userType == "Seller") && (
                    <div className="mb-3">
                      <label className={`${styles.label} form-label`}>
                        Upload Id File:
                        <input type="file" accept="pdf" onChange={handleFileChange(setIdFile)} className="form-control" required/>
                      </label>
                    </div>
                )}

                {(userType == "Advertiser" || userType == "Seller") && (
                    <div className="mb-3">
                      <label className={`${styles.label} form-label`}>
                        Upload Tax Registration Card:
                        <input type="file" accept="pdf" onChange={handleFileChange(setTaxCardFile)} className="form-control" required/>
                      </label>
                    </div>
                )}

                {textBoxes[0] && (
                    <>
                      <div className="mb-3">
                        <label className={`${styles.label} form-label`}>
                          Website link:
                          <input className={`${styles.input} form-control`}
                            type="url"
                            value={websiteLink}
                            onChange={(e) => setWebsiteLink(e.target.value)}
                            required
                          />
                        </label>
                      </div>

                      <div className="mb-3">
                        <label className={`${styles.label} form-label`}>
                          Hotline:
                          <input className={`${styles.input} form-control`}
                            type="tel"
                            value={hotline}
                            onChange={(e) => setHotline(e.target.value)}
                            required
                          />
                        </label>
                      </div>

                      <div className="mb-3">
                        <label className={`${styles.label} form-label`}>
                          Company profile:
                          <textarea
                            className={`${styles.input} form-control`}
                            value={companyProfile}
                            onChange={(e) => setCompanyProfile(e.target.value)}
                            required
                          />
                        </label>
                      </div>
                    </>
                )}

                {textBoxes[1] && (
                    <>
                      <div className="mb-3">
                        <label className={`${styles.label} form-label`}>
                          Seller name:
                          <input className={`${styles.input} form-control`}
                            type="text"
                            value={sellerName}
                            onChange={(e) => setSellerName(e.target.value)}
                            required
                          />
                        </label>
                      </div>

                      <div className="mb-3">
                        <label className={`${styles.label} form-label`}>
                          Description:
                          <textarea
                            className={`${styles.input} form-control`}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                          />
                        </label>
                      </div>
                    </>
                )}

                {textBoxes[2] && (
                    <>
                      <div className="mb-3">
                        <label className={`${styles.label} form-label`}>
                          Mobile number:
                          <input className={`${styles.input} form-control`}
                            type="tel"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            required
                          />
                        </label>
                      </div>

                      <div className="mb-3">
                        <label className={`${styles.label} form-label`}>
                          Years of experience:
                          <input className={`${styles.input} form-control`}
                            type="number"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            required
                          />
                        </label>
                      </div>

                      <div className="mb-3">
                        <label className={`${styles.label} form-label`}>
                          Previous work (if exists):
                          <textarea
                            className={`${styles.input} form-control`}
                            value={previousWork}
                            onChange={(e) => setPreviousWork(e.target.value)}
                          />
                        </label>
                      </div>
                    </>
                )}

                <div className="mb-3">
                  <div className="form-check">
                    <input className="form-check-input"
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      required
                    />
                    <label className="form-check-label" htmlFor="terms">
                      I agree to the terms and conditions
                    </label>
                  </div>
                  <span onClick={openModal} className="text-primary" style={{cursor: 'pointer'}}>
                    Click here for the terms and conditions.
                  </span>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Sign Up
                </button>
              </form>
            </div>
          </div>
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

      <Footer/>
    </div>
  );
};

export default SignUpExtra;
