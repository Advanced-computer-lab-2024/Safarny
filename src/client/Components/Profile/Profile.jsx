import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa"; // Import the notification bell icon
import styles from "./Profile.module.css";
import Footer from "/src/client/components/Footer/Footer";
import Header from "/src/client/components/Header/Header";
import { Button } from "@mui/material";
import axios from "axios";

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {}; // Get userId from location state if it exists
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    role: "",
    image: "",
    loyaltyPoints: 0,
    wallet: 0,
    walletCurrency: "EGP"
  });
  const [message, setMessage] = useState("");
  const [showButtons, setShowButtons] = useState(false);
  const [showBookingsButtons, setShowBookingsButtons] = useState(false);
  const [showComplaintsButtons, setShowComplaintsButtons] = useState(false);
  const [showTransportationsButtons, setShowTransportButtons] = useState(false);
  const [showPostButtons, setShowPostButtons] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/tourist/profile?id=${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const { password, __v, _id, imageurl, ...userData } =
            await response.json();
        setUserInfo({ ...userData, image: imageurl });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleCashInPoints = async () => {
    try {
      if (userInfo.loyaltyPoints === 0) {
        setMessage("You do not have any loyalty points!");
        return;
      }

      const response = await fetch(import.meta.env.VITE_EXCHANGE_API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const exchangeRate = data.conversion_rates[userInfo.walletcurrency];
      const pointsInWallet = userInfo.loyaltyPoints * 0.01 * exchangeRate;

      if (isNaN(pointsInWallet)) {
        throw new Error("Invalid points calculation");
      }

      if (!userId) {
        throw new Error("User ID is required");
      }

      await axios.put(`http://localhost:3000/tourist/${userId}`, {
        wallet: userInfo.wallet + pointsInWallet,
        loyaltyPoints: 0
      });

      setUserInfo((prevState) => ({
        ...prevState,
        wallet: prevState.wallet + pointsInWallet,
        loyaltyPoints: 0
      }));

      setMessage("Points redeemed!");
    } catch (error) {
      console.error("Error cashing in points:", error);
    }
  };

  const handleUpdateClick = () => {
    localStorage.setItem("userId", userId);
    window.location.href = "/UpdateProfile";
  };

  const handleProductViewClick = () => {
    navigate("/products", { state: { userId } });
  };

  const handleSellerHomeClick = () => {
    navigate("/seller", { state: { userId } });
  };

  const handlePostClick = () => {
    navigate("/create-post");
  };

  const handleAddActivity = () => {
    localStorage.setItem("userId", userId);
    navigate("/AdvertiserMain");
  };

  const handleCreateHistoricalPlaceClick = () => {
    navigate("/create-historical-place", { state: { userId } });
  };

  const handleBookFlight = () => {
    navigate("/BookFlight", { state: { userId } });
  };

  const handleBookHotel = () => {
    navigate("/BookHotel", { state: { userId } });
  };

  const handleUpdateClick2 = () => {
    navigate("/Search");
  };

  const handleUpcomingActivitiesClick = () => {
    navigate("/UpcomingActivites", { state: { userId } });
  };

  const handleUpcomingItinerariesClick = () => {
    navigate("/UpcomingItineraries", { state: { userId } });
  };

  const handleViewHistoricalPlacesClick = () => {
    navigate("/historical-places", { state: { userId } });
  };

  const handleCreateHistoricalTagClick = () => {
    navigate("/historical-tags");
  };

  const handleAddItinerary = () => {
    navigate("/tourguide", { state: { userId } });
  };

  const handleCreateComplaint = () => {
    navigate("/createcomplaints", { state: { userId } });
  };

  const handleViewComplaints = () => {
    navigate("/viewcomplaints", { state: { userId } });
  };

  const handelWishList = () => {
    navigate("/wishlist", { state: { userId } });
  };

  // Advertiser-specific transport buttons
  const handleCreateTransportClick = () => {
    navigate("/transportss/create-transport", { state: { userId } });
  };

  const handleEditTransportClick = () => {
    navigate("/transportss/edit-transport", { state: { userId } });
  };

  const handlebookTransportClick = () => {
    navigate("/transportss/book-transport", { state: { userId } });
  };

  const handleMyBookingsClick = () => {
    navigate("/mybookings", { state: { userId } });
  };

  const handleMyPreferencesClick = () => {
    navigate("/PreferencesPage", { state: { userId } });
  };

  const handleDelete = async () => {
    if (userInfo.role === "Seller") {
      axios.put(`/seller/delete_request/${userId}`, { delete_request: true });
    }
    else if (userInfo.role === "TourGuide") {
      axios.put(`/tourGuide/delete_request/${userId}`, { delete_request: true });
    }
    else if (userInfo.role === "Tourist") {
      axios.put(`/tourist/delete_request/${userId}`, { delete_request: true });
    }
    else if (userInfo.role === "Advertiser") {
      axios.put(`/advertiser/delete_request/${userId}`, { delete_request: true });
    }
  };

  const handleViewButtonClick = () => setShowButtons((prevShow) => !prevShow);
  const handleBookingsButtonClick = () => setShowBookingsButtons(prev => !prev);
  const handleComplaintsButtonClick = () => setShowComplaintsButtons(prev => !prev);
  const handleTransportButtonClick = () => setShowTransportButtons(prev => !prev);
  const handlePostButtonClick = () => setShowPostButtons(prev => !prev);

  return (
      <div className={styles.container}>
        <Header />

        <main className={styles.main}>
          <button className={styles.notificationButton}>
            <FaBell />
          </button>
          <section className={styles.intro}>
            <h1>Welcome, {userInfo.username}!</h1>
            <h5>Your account details:</h5>
            {userInfo.role === "TourismGovernor" ? (
                <>
                  <p>Username: {userInfo.username}</p>
                  <p>Email: {userInfo.email}</p>
                  <p>Role: {userInfo.role}</p>
                </>
            ) : (
                Object.entries(userInfo)
                    .filter(([key]) => key !== "image")
                    .map(([key, value]) => (
                        <p key={key}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                        </p>
                    ))
            )}
            {userInfo.image && (
                <img
                    src={userInfo.image}
                    alt="Profile"
                    className={styles.profileImage}
                />
            )}
          </section>
          {userInfo.role === "Tourist" && (
              <div className={styles.loyaltyBadge}>
                <p>Badge: </p>
                {userInfo.loyaltyLevel === "level 1" && (
                    <img src="src/client/Assets/Img/rank1.jpg" alt="Rank 1 Badge" className={styles.rankBadge} />
                )}
                {userInfo.loyaltyLevel === "level 2" && (
                    <img src="src/client/Assets/Img/rank2.jpg" alt="Rank 2 Badge" className={styles.rankBadge} />
                )}
                {userInfo.loyaltyLevel === "level 3" && (
                    <img src="src/client/Assets/Img/rank3.jpg" alt="Rank 3 Badge" className={styles.rankBadge} />
                )}
              </div>
          )}
          <br></br>
          <button onClick={handleCashInPoints} className={styles.cashInButton}>
            Cash in points
          </button>
          {message && <p style={{ textAlign: 'center' }}>{message}</p>}
        </main>

        <div className={styles.organizedButtonContainer}>
          <div className={styles.delete_requestButton}>
            <Button onClick={handleDelete}>Request Account To be Deleted</Button>
          </div>
          <div className={styles.buttonGroup}>
            <button onClick={handleProductViewClick} className={styles.productButton}>
              View Products
            </button>
            <button onClick={handleUpdateClick2} className={styles.searchButton}>
              Search
            </button>
            <button onClick={handleUpdateClick} className={styles.searchButton}>
              Update Profile
            </button>
          </div>

          {userInfo.role === "TourismGovernor" && (
              <div className={styles.buttonGroup}>
                <button onClick={handleCreateHistoricalPlaceClick} className={styles.createPlaceButton}>
                  Create Historical Place
                </button>
                <button onClick={handleCreateHistoricalTagClick} className={styles.createTagButton}>
                  Create Historical Tag
                </button>
              </div>
          )}
          {userInfo.role === "Tourist" && (
              <div className={styles.buttonGroup}>
                <button onClick={handelWishList} className={styles.mainButton}>
                  View Wish List
                </button>
              </div>
          )}

          <div className={styles.buttonGroup}>
            <button onClick={handleBookingsButtonClick} className={styles.mainButton}>
              View & Book Services
            </button>
            {showBookingsButtons && (
                <div className={styles.subButtonGroup}>
                  <button onClick={handleBookFlight} className={styles.subButton}>
                    Book A Flight
                  </button>
                  <button onClick={handleBookHotel} className={styles.subButton}>
                    Book A Hotel
                  </button>
                  <button onClick={handlebookTransportClick} className={styles.subButton}>
                    Book Transports
                  </button>
                  <button onClick={handleMyBookingsClick} className={styles.subButton}>
                    My Bookings
                  </button>
                  <button onClick={handleMyPreferencesClick} className={styles.subButton}>
                    Select Your Preferences
                  </button>
                </div>
            )}
          </div>

          <div className={styles.buttonGroup}>
            <button onClick={handleComplaintsButtonClick} className={styles.mainButton}>
              Manage Complaints
            </button>
            {showComplaintsButtons && (
                <div className={styles.subButtonGroup}>
                  <button onClick={handleCreateComplaint} className={styles.subButton}>
                    Create Complaint
                  </button>
                  <button onClick={handleViewComplaints} className={styles.subButton}>
                    View Complaints
                  </button>
                </div>
            )}
          </div>

          {userInfo.role === "Seller" && (
              <div className={styles.buttonGroup}>
                <button onClick={handlePostButtonClick} className={styles.mainButton}>
                  Manage Products
                </button>
                {showPostButtons && (
                    <div className={styles.subButtonGroup}>
                      <button onClick={handlePostClick} className={styles.postButton}>
                        Add Product
                      </button>
                      <button onClick={handleSellerHomeClick} className={styles.postButton}>
                        My Products
                      </button>
                    </div>
                )}
              </div>
          )}

          {userInfo.role === "Advertiser" && (
              <div className={styles.buttonGroup}>
                <button onClick={handleTransportButtonClick} className={styles.mainButton}>
                  Transportation and Activities
                </button>
                {showTransportationsButtons && (
                    <div className={styles.subButtonGroup}>
                      <button onClick={handleAddActivity} className={styles.postButton}>
                        Activity
                      </button>
                      <button onClick={handleCreateTransportClick} className={styles.postButton}>
                        Create Transport
                      </button>
                      <button onClick={handleEditTransportClick} className={styles.postButton}>
                        Edit & Delete Transport
                      </button>
                    </div>
                )}
              </div>
          )}

          {userInfo.role === "TourGuide" && (
              <div className={styles.buttonGroup}>
                <button onClick={handleAddItinerary} className={styles.postButton}>
                  Add Itinerary
                </button>
              </div>
          )}

          <button onClick={handleViewButtonClick} className={styles.mainButton}>
            View Upcoming Events
          </button>
          {showButtons && (
              <div className={styles.subButtonGroup}>
                <button onClick={handleUpcomingActivitiesClick} className={styles.subButton}>
                  Upcoming Activities
                </button>
                <button onClick={handleUpcomingItinerariesClick} className={styles.subButton}>
                  Upcoming Itineraries
                </button>
                <button onClick={handleViewHistoricalPlacesClick} className={styles.subButton}>
                  Upcoming Historical Places
                </button>
              </div>
          )}
        </div>

        <Footer />
      </div>
  );
};

export default Profile;