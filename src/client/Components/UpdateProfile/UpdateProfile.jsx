import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '/src/client/components/Footer/Footer';
import Header from '/src/client/components/Header/Header';
// import Logo from '/src/client/Assets/Img/logo.png';
import styles from './UpdateProfile.module.css';
import { Link, useLocation } from 'react-router-dom';

const UpdateProfile = () => {
  const userId = localStorage.getItem('userId');
  console.log(userId);

  const location = useLocation();

  // State variables to hold user information
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
    nationality: '',
    mobile: '',
    employed: '',
    age: '',
    role: '', // Add role field
    YearOfExp: '',
    PrevWork: '',
    CompanyLink: '',
    CompanyHotline: '',
    CompanyName: '', // Update to CompanyName
    sellerName: '',
    description: '',
    addresses: [], // Added addresses state
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state

  // Fetch current user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/tourist/${userId}`);
        console.log('Fetched user data:', response.data);
        const { email, password, username, role } = response.data;

        if (role === 'Tourism Governor') {
          // Only set the fields relevant to Tourism Governor
          setUserInfo({ email, password, username, role });
        } else {
          setUserInfo(response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setErrorMessage('Error fetching user data.');
      } finally {
        setLoading(false); // Set loading to false after fetch completes
      }
    };

    fetchUserData();
  }, [userId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/tourist/${userId}`, {
        ...userInfo,
        id: userId, // Include userId in the request body
        addresses: userInfo.addresses // Include addresses in the request
      });
      setSuccessMessage(response.data.message);
      setErrorMessage('');
    } catch (error) {
      console.error('Error updating user data:', error);
      setErrorMessage(error.response ? error.response.data.error : 'An unexpected error occurred.');
      setSuccessMessage('');
    }
  };

  // Function to return the list of country options
  const getCountryOptions = () => {
    const countries = [
      "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
      "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
      "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
      "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the",
      "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
      "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
      "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
      "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
      "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South",
      "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein",
      "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
      "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
      "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway",
      "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland",
      "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
      "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
      "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
      "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
      "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu",
      "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
    ];

    return countries.map(country => <option key={country} value={country}>{country}</option>);
  };

  // Function to render role-specific fields
  const renderRoleSpecificFields = (role, userInfo) => {
    console.log(`Rendering fields for role: ${role}`);
    switch (role) {
      case 'TourGuide':
        return (
          <>
            <label>
              Years of Experience:
              <input
                type="number"
                value={userInfo.YearOfExp}
                onChange={(e) => setUserInfo({ ...userInfo, YearOfExp: e.target.value })}
              />
            </label>
            <label>
              Previous Work:
              <input
                type="text"
                value={userInfo.PrevWork}
                onChange={(e) => setUserInfo({ ...userInfo, PrevWork: e.target.value })}
              />
            </label>
          </>
        );


      case 'Advertiser':
        return (
          <>
            <label>
              Company Profile:
              <input
                type="text"
                value={userInfo.CompanyName}
                onChange={(e) => setUserInfo({ ...userInfo, CompanyName: e.target.value })}
              />
            </label>
            <label>
              Company Link:
              <input
                type="url"
                value={userInfo.CompanyLink}
                onChange={(e) => setUserInfo({ ...userInfo, CompanyLink: e.target.value })}
              />
            </label>
            <label>
              Company Hotline:
              <input
                type="text"
                value={userInfo.CompanyHotline}
                onChange={(e) => setUserInfo({ ...userInfo, CompanyHotline: e.target.value })}
              />
            </label>
          </>
        );
      case 'Seller':
        return (
          <>
            <label>
              Seller Name:
              <input
                type="text"
                value={userInfo.sellerName}
                onChange={(e) => setUserInfo({ ...userInfo, sellerName: e.target.value })}
              />
            </label>
            <label>
              Description:
              <textarea
                value={userInfo.description}
                onChange={(e) => setUserInfo({ ...userInfo, description: e.target.value })}
              />
            </label>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />

      <div className="container py-5">
        <div className={styles.profileCard}>
          <div className={styles.cardHeader}>
            <h2>Update Your Profile</h2>
            {/* <p>Manage your personal information and account settings</p> */}
          </div>

          {loading ? (
            <div className={styles.loadingState}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {successMessage && (
                <div className={`alert alert-success ${styles.alertCustom}`}>
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className={`alert alert-danger ${styles.alertCustom}`}>
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.updateForm}>
                <div className="row g-4">
                  {/* Basic Information Section */}
                  <div className="col-12">
                    <div className={styles.formSection}>
                      {/* <h3 className={styles.formHeading}>Basic Information</h3> */}
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className={styles.formGroup}>
                            <label>Email</label>
                            <input
                              type="email"
                              className="form-control"
                              value={userInfo.email}
                              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className={styles.formGroup}>
                            <label>Password</label>
                            <input
                              type="password"
                              className="form-control"
                              value={userInfo.password}
                              onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personal Details Section */}
                  {userInfo.role !== 'TourismGovernor' && (
                    <div className="col-12">
                      <div className={styles.formSection}>
                        {/* <h3>Personal Details</h3> */}
                        <div className="row g-3">
                          <div className="col-md-6">
                            <div className={styles.formGroup}>
                              <label>Nationality</label>
                              <select
                                className="form-select"
                                value={userInfo.nationality}
                                onChange={(e) => setUserInfo({ ...userInfo, nationality: e.target.value })}
                                required
                              >
                                <option value="">Select Nationality</option>
                                {getCountryOptions()}
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className={styles.formGroup}>
                              <label>Mobile</label>
                              <input
                                type="tel"
                                className="form-control"
                                value={userInfo.mobile}
                                onChange={(e) => setUserInfo({ ...userInfo, mobile: e.target.value })}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className={styles.formGroup}>
                              <label>Employment Status</label>
                              <select
                                className="form-select"
                                value={userInfo.employed}
                                onChange={(e) => setUserInfo({ ...userInfo, employed: e.target.value })}
                                required
                              >
                                <option value="">Select Status</option>
                                <option value="Yes">Employed</option>
                                <option value="No">Unemployed</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className={styles.formGroup}>
                              <label>Age</label>
                              <input
                                type="number"
                                className="form-control"
                                value={userInfo.age}
                                onChange={(e) => setUserInfo({ ...userInfo, age: e.target.value })}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Addresses Section */}
                  <div className="col-12">
                    <div className={styles.formSection}>
                      {/* <h3>Addresses</h3> */}
                      <div className={styles.addressList}>
                        {userInfo.addresses.map((address, index) => (
                          <div key={index} className={styles.addressItem}>
                            <input
                              type="text"
                              className="form-control"
                              value={address}
                              onChange={(e) => {
                                const newAddresses = [...userInfo.addresses];
                                newAddresses[index] = e.target.value;
                                setUserInfo({ ...userInfo, addresses: newAddresses });
                              }}
                            />
                            <button
                              type="button"
                              className={styles.removeButton}
                              onClick={() => {
                                const newAddresses = userInfo.addresses.filter((_, i) => i !== index);
                                setUserInfo({ ...userInfo, addresses: newAddresses });
                              }}
                            >
                              X
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className={styles.addButton}
                          onClick={() => setUserInfo({ ...userInfo, addresses: [...userInfo.addresses, ''] })}
                        >
                          <i className="fas fa-plus me-2"></i>
                          Add Address
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Account Information */}
                  <div className="col-12">
                    <div className={styles.formSection}>
                      {/* <h3>Account Information</h3> */}
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className={styles.formGroup}>
                            <label>Role</label>
                            <input
                              type="text"
                              className="form-control"
                              value={userInfo.role}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className={styles.formGroup}>
                            <label>Username</label>
                            <input
                              type="text"
                              className="form-control"
                              value={userInfo.username}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Role Specific Fields */}
                  <div className="col-12">
                    <div className={styles.formSection}>
                      {renderRoleSpecificFields(userInfo.role, userInfo)}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="col-12">
                    <button type="submit" className={styles.submitButton}>
                      Update Profile
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UpdateProfile;

