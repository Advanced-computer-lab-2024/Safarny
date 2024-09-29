import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./SignUpExtra.css";
import Footer from "/src/client/Components/Footer/Footer";
import Logo from "/src/client/Assets/Img/logo.png";
import styles from "/src/client/Components/Signup/SignUp.module.css";

const SignUpExtra = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Additional state variables for the input fields based on user type
  const [websiteLink, setWebsiteLink] = useState("");
  const [hotline, setHotline] = useState("");
  const [companyProfile, setCompanyProfile] = useState("");

  const [sellerName, setSellerName] = useState("");
  const [description, setDescription] = useState("");

  const [mobileNumber, setMobileNumber] = useState("");
  const [experience, setExperience] = useState("");
  const [previousWork, setPreviousWork] = useState("");

  const [textBoxes, setTextBoxes] = useState(new Array(3).fill(false));

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      username,
      password,
      email,
      userType,
      websiteLink,
      hotline,
      companyProfile,
      sellerName,
      description,
      mobileNumber,
      experience,
      previousWork,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/signupextra",
        userData
      );
      if (response.status === 201) {
        setSuccess(true);
        setError("");
        navigate("/signin");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
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

  return (
    <div className="container">
      <header className={styles.header}>
        <img src={Logo} alt="Safarny Logo" className={styles.logo} />
        <h1>Safarny</h1>
        <nav className={styles.nav}>
          <Link to="/" className={styles.button}>
            Back to Home
          </Link>
        </nav>
      </header>

      <div className="formContainer">
        <h2>Sign up extra</h2>
        {success && <p className="successMessage">Sign up successful!</p>}
        {error && <p className="errorMessage">{error}</p>}

        <form onSubmit={handleSubmit} className="form">
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            I am a:
            <select
              value={userType}
              onChange={(e) => handleUserTypeChange(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              <option value="Tour Guide">Tour Guide</option>
              <option value="Advertiser">Advertiser</option>
              <option value="Seller">Seller</option>
            </select>
          </label>

          {/* Advertiser Input Fields */}
          {textBoxes[0] && (
            <>
              <label>
                Website link:
                <input
                  type="url"
                  value={websiteLink}
                  onChange={(e) => setWebsiteLink(e.target.value)}
                  required
                />
              </label>
              <label>
                Hotline:
                <input
                  type="tel"
                  value={hotline}
                  onChange={(e) => setHotline(e.target.value)}
                  required
                />
              </label>
              <label>
                Company profile:
                <textarea
                  value={companyProfile}
                  onChange={(e) => setCompanyProfile(e.target.value)}
                  required
                />
              </label>
            </>
          )}

          {/* Seller Input Fields */}
          {textBoxes[1] && (
            <>
              <label>
                Seller name:
                <input
                  type="text"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  required
                />
              </label>
              <label>
                Description:
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </label>
            </>
          )}

          {/* Tour Guide Input Fields */}
          {textBoxes[2] && (
            <>
              <label>
                Mobile number:
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                />
              </label>
              <label>
                Years of experience:
                <input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  required
                />
              </label>
              <label>
                Previous work (if exists):
                <textarea
                  value={previousWork}
                  onChange={(e) => setPreviousWork(e.target.value)}
                />
              </label>
            </>
          )}

          <button type="submit" className="button">
            Sign Up
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default SignUpExtra;
