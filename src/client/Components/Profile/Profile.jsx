import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa"; // Import the notification bell icon
import styles from "./Profile.module.css";
import Footer from "/src/client/components/Footer/Footer";
import Header from "/src/client/components/Header/Header";
// import { Button } from "@mui/material";
import axios from "axios";
import ProfileSideBar from "../ProfileSideBar/ProfileSideBar";
import ProfileHeader from "../ProfileHeader/ProfileHeader";

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
    walletcurrency: "EGP"
  });
  const [message, setMessage] = useState("");
  const [showButtons, setShowButtons] = useState(false);
  const [showBookingsButtons, setShowBookingsButtons] = useState(false);
  const [showComplaintsButtons, setShowComplaintsButtons] = useState(false);
  const [showTransportationsButtons, setShowTransportButtons] = useState(false);
  const [showPostButtons, setShowPostButtons] = useState(false);
  const audioRef = useRef(null);

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
        if ((userData.username === 'Nirvanaa' || userData.username === 'nirvana' || userData.username === 'Nirvana' || userData.username === 'Nirvana1') && !audioRef.current) {
          audioRef.current = new Audio(soundFile);
          audioRef.current.play();
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
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

  const handleGuidePageClick = () => {
    navigate("/GuidePage", { state: { userId } });
  };

  const handleSellerHomeClick = () => {
    navigate("/seller", { state: { userId } });
  };

  const handlePostClick = () => {
    navigate("/create-post", { state: { userId } });
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
  const handleNotification = () => {
    navigate("/notifications", { state: { userId } });
  }
  // const handleViewButtonClick = () => setShowButtons((prevShow) => !prevShow);
  // const handleBookingsButtonClick = () => setShowBookingsButtons(prev => !prev);
  // const handleComplaintsButtonClick = () => setShowComplaintsButtons(prev => !prev);
  // const handleTransportButtonClick = () => setShowTransportButtons(prev => !prev);
  // const handlePostButtonClick = () => setShowPostButtons(prev => !prev);

  return (
    <div className={styles.container}>
      <ProfileHeader userId={userId} userInfo={userInfo} />
      <main className={styles.main}>
        {/* <ProfileSideBar userId={userId} userInfo={userInfo} /> */}
        <section className={styles.intro}>
          <button className={styles.notificationButton} onClick={handleNotification}>
            <FaBell/>
          </button>
          <div className={styles.profileHeader}>
            {userInfo.image && (
                <img src={userInfo.image} alt="Profile" className={styles.profileImage}/>
            )}
            <div className={styles.userInfo}>
              <h1>Welcome, {userInfo.username}!</h1>
              <h5>Your account details:</h5>
              <p>Role: <strong>{userInfo.role}</strong></p>
              <p>Email: <strong>{userInfo.email}</strong></p>
              <p>Loyalty Points: <strong>{userInfo.loyaltyPoints}</strong></p>
              <p>Wallet: <strong>{userInfo.wallet.toFixed(2)} {userInfo.walletcurrency}</strong></p>
            </div>
          </div>
          {userInfo.role === "Tourist" && userInfo.loyaltyLevel && (
              <div className={styles.loyaltyBadge}>
                <p>Badge: </p>
                {userInfo.loyaltyLevel === "level 1" && (
                    <img src="src/client/Assets/Img/rank1.jpg" alt="Rank 1 Badge" className={styles.rankBadge}/>
                )}
                {userInfo.loyaltyLevel === "level 2" && (
                    <img src="src/client/Assets/Img/rank2.jpg" alt="Rank 2 Badge" className={styles.rankBadge}/>
                )}
                {userInfo.loyaltyLevel === "level 3" && (
                    <img src="src/client/Assets/Img/rank3.jpg" alt="Rank 3 Badge" className={styles.rankBadge}/>
                )}
              </div>
          )}
        </section>

        <button onClick={handleCashInPoints} className={styles.subButton}>
          Cash in points
        </button>
        <button onClick={handleGuidePageClick} className={styles.guideButton}>
          Guide Page
        </button>
        {message && <p style={{ textAlign: 'center' }}>{message}</p>}
      </main>
      <Footer />
    </div>
  );


};

export default Profile;