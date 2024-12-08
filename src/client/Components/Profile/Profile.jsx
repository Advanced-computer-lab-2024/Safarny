import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import styles from "./Profile.module.css";
import Footer from "/src/client/components/Footer/Footer";
import Header from "/src/client/components/Header/Header";
import ProfileSideBar from "../ProfileSideBar/ProfileSideBar";
import axios from "axios";

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};

  console.log("Initial render - userId:", userId);
  console.log("Location state:", location.state);

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    role: "",
    photo: "",
    loyaltyPoints: 0,
    wallet: 0,
    walletcurrency: "EGP"
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  const audioRef = useRef(null); // Define audioRef using useRef

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/tourist/profile?id=${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        console.log("Fetched user data:", data); // Log the entire response
        const { password, __v, _id, ...userData } = data;
        setUserData(userData);
        setLoading(false); // Set loading to false after data is fetched

        if ((userData.username === 'Nirvanaa' || userData.username === 'nirvana' || userData.username === 'Nirvana' || userData.username === 'Nirvana1') && !audioRef.current) {
          audioRef.current = new Audio(soundFile);
          audioRef.current.play();
        }

        console.log("User data:", userData);
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

            // Add promo code to user's array of promos
            await axios.put(`/tourist/${userId}`, {
              promos: [...userData.promos, randomPromoCode.code]
            });

            console.log("Promo code added to user's promos");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false); // Set loading to false in case of error
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

  console.log("Current userData state:", userData);

  const handleCashInPoints = async () => {
    try {
      if (userData.loyaltyPoints === 0) {
        setMessage("You do not have any loyalty points!");
        return;
      }

      const response = await fetch(import.meta.env.VITE_EXCHANGE_API_URL);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const exchangeRate = data.conversion_rates[userData.walletcurrency];
      const pointsInWallet = userData.loyaltyPoints * 0.01 * exchangeRate;

      await axios.put(`/tourist/${userId}`, {
        wallet: userData.wallet + pointsInWallet,
        loyaltyPoints: 0
      });

      setUserData(prev => ({
        ...prev,
        wallet: prev.wallet + pointsInWallet,
        loyaltyPoints: 0
      }));

      setMessage("Points redeemed successfully!");
    } catch (error) {
      console.error("Error cashing in points:", error);
      setMessage("Failed to redeem points. Please try again.");
    }
  };

  if (!userId) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div className={styles.profileWrapper}>
      <ProfileSideBar userId={userId} userInfo={userData} />

      <Header />

      <main className={`${styles.mainContent} container-fluid`}>
        <div className={styles.patternOverlay} />
        <div className={`${styles.profileCard} card shadow`}>
          <div className="row g-0">
            <div className="col-md-4 text-center p-4 bg-primary text-white">
              {loading ? (
                <div>Loading photo...</div>
              ) : (
                <img
                  src={userData.photo || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className={`${styles.profileImage} mb-3`}
                />
              )}
              <h4 className="fw-bold">{userData.username}</h4>
              <p className="mb-0">{userData.email}</p>
            </div>

            <div className="col-md-8">
              <div className={`${styles.infoSection} card-body`}>
                <h5 className="card-title text-primary mb-4">
                  Welcome, {userData.username}!
                </h5>
                <div className="mb-3">
                  <p className="card-text">
                    <strong>Role:</strong> {userData.role}
                  </p>
                  <p className="card-text">
                    <strong>Loyalty Points:</strong> {userData.loyaltyPoints}
                  </p>
                  <p className="card-text">
                    <strong>Wallet:</strong> {userData.wallet.toFixed(2)}{" "}
                    {userData.walletcurrency}
                  </p>
                </div>

                {userData.role === "Tourist" && (
                  <div className="mt-4">
                    <button
                      className={`btn btn-success ${styles.cashInButton}`}
                      onClick={handleCashInPoints}
                      disabled={userData.loyaltyPoints === 0}
                    >
                      Cash in Points
                    </button>
                    {message && (
                      <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} mt-3`}>
                        {message}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;