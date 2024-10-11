import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Footer from "/src/client/Components/Footer/Footer";
import Header from "/src/client/Components/Header/Header";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../server/config/Firebase"; // Adjust the path as necessary
import styles from "/src/client/Components/Signup/SignUp.module.css"; // Import your signup styles

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

  const [textBoxes, setTextBoxes] = useState(new Array(3).fill(false));

  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
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
    
    try {
      let imageUrl = null;
      // Upload image if a file is selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

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
      };

      const response = await axios.post("/guest/others-signup", userData);
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
    <div className={styles.container}> {/* Use styles from SignUp.module.css */}
      <Header />
      <div className={styles.formContainer}> {/* Use styles from SignUp.module.css */}
        <h2>Sign up extra</h2>
        {success && <p className={styles.successMessage}>Sign up successful!</p>} {/* Use styles from SignUp.module.css */}
        {error && <p className={styles.errorMessage}>{error}</p>} {/* Use styles from SignUp.module.css */}
        <form onSubmit={handleSubmit} className={styles.form}> {/* Use styles from SignUp.module.css */}
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
              <option value="TourGuide">Tour Guide</option>
              <option value="Advertiser">Advertiser</option>
              <option value="Seller">Seller</option>
            </select>
          </label>

          {/* Image upload field */}
          {userType && (
            <label>
              Upload Image:
              <input type="file" accept="image/*" onChange={handleImageUpload} required />
            </label>
          )}

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

          <button type="submit" className={styles.button}> {/* Use styles from SignUp.module.css */}
            Sign Up
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default SignUpExtra;
