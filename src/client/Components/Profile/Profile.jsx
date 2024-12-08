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
        const { password, __v, _id, imageurl, ...userData } = await response.json();
        setUserInfo({ ...userData, image: imageurl });

        if ((userData.username === 'Nirvanaa' || userData.username === 'nirvana' || userData.username === 'Nirvana' || userData.username === 'Nirvana1') && !audioRef.current) {
          audioRef.current = new Audio(soundFile);
          audioRef.current.play();
        }

        console.log("User data:", userData);
        // console.log("User data:", userinfo);
        // Check if today is the user's birthday
        if (userData.role === "Tourist") {
          const today = new Date();
          const userBirthday = new Date(userData.DOB);
          console.log("Today:", today, "User birthday:", userBirthday);
          if (today.getMonth() === userBirthday.getMonth() && today.getDate() === userBirthday.getDate()) {
            // Fetch promo codes
            const promoResponse = await fetch('/promocodes/promocodes');
            if (!promoResponse.ok) {
              throw new Error("Failed to fetch promo codes");
            }
            const promoCodes = await promoResponse.json();

            // Select a random promo code
            const randomPromoCode = promoCodes[Math.floor(Math.random() * promoCodes.length)];

            // Send notification
            await axios.post('/notification/create', {
              title: 'Promo Code',
              userId,
              message: `You have received a promo code: ${randomPromoCode.code}`
            });

            // Send email
            console.log("Sending promo code to user:", userData.email);
            const emailResponse = await axios.post('/email/send-email', {
              to: userData.email,
              subject: 'Your Promo Code',
              text: `Congratulations! You have received a promo code: ${randomPromoCode.code}`
            });
            console.log("Email response:", JSON.stringify(emailResponse.data, null, 2));
            console.log("Promo code sent to user");
          }
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

  const handleGuidePageClick = () => {
    navigate("/GuidePage", { state: { userId } });
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
      <div className={`container ${styles.profileContainer} my-5`}>
        <div className="card shadow-lg">
          <div className="row g-0">
            <div className="col-md-4 text-center p-4 bg-primary text-white">
              <img
                src={userInfo.photo || "https://via.placeholder.com/150"}
                alt="Profile"
                className={`rounded-circle img-fluid mb-3 ${styles.profileImage}`}
                style={{ maxWidth: "150px" }}
              />
              <h4 className="fw-bold">{userInfo.username}</h4>
              <p>{userInfo.email}</p>
              <button className={`${styles.notificationIcon} text-white`} onClick={handleNotification} title="Notifications">
                <FaBell />
              </button>
            </div>

            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title text-primary">
                  Welcome, {userInfo.username}!
                </h5>
                <p className="card-text">
                  <strong>Role:</strong> {userInfo.role}
                </p>
                <p className="card-text">
                  <strong>Loyalty Points:</strong> {userInfo.loyaltyPoints}
                </p>
                <p className="card-text">
                  <strong>Wallet:</strong> {userInfo.wallet.toFixed(2)}{" "}
                  {userInfo.walletcurrency}
                </p>
                {userInfo.role === "Tourist" && userInfo.loyaltyLevel && (
                  <div>
                    <strong>Badge:</strong>{" "}
                    <img
                      src={`/src/client/Assets/Img/rank${userInfo.loyaltyLevel}.jpg`}
                      alt="Loyalty Badge"
                      className="img-fluid"
                      style={{ maxWidth: "50px" }}
                    />
                  </div>
                )}
                <div className="mt-4">
                  <button
                    onClick={handleCashInPoints}
                    className={`btn btn-success me-2 ${styles.cashInButton}`}
                  >
                    Cash in Points
                  </button>
                  <button
                    onClick={() => navigate("/GuidePage")}
                    className="btn btn-dark"
                  >
                    Guide Page
                  </button>
                </div>
                {message && <p className="text-success mt-3">{message}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );


};

export default Profile;