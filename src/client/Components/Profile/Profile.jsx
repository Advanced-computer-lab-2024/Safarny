import React, { useState, useEffect } from "react";
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

    const [userInfo, setUserInfo] = useState({
        username: "",
        email: "",
        role: "",
        photo: "",
        loyaltyPoints: 0,
        wallet: 0,
        walletcurrency: "EGP"
    });
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            console.log("Fetching user data for userId:", userId);
            try {
                const response = await fetch(`/tourist/profile?id=${userId}`);
                console.log("API Response:", response);
                
                if (!response.ok) {
                    console.error("Response not OK:", response.status, response.statusText);
                    throw new Error("Failed to fetch user data");
                }
                
                const data = await response.json();
                console.log("Received user data:", data);
                
                const { password, __v, _id, imageurl, ...userData } = data;
                console.log("Processed user data:", userData);
                
                setUserInfo({ ...userData, photo: imageurl });
            } catch (error) {
                console.error("Error in fetchUserData:", error);
            }
        };

        if (userId) {
            console.log("UserId exists, calling fetchUserData");
            fetchUserData();
        } else {
            console.log("No userId found in location state");
        }
    }, [userId]);

    console.log("Current userInfo state:", userInfo);

    const handleCashInPoints = async () => {
        try {
            if (userInfo.loyaltyPoints === 0) {
                setMessage("You do not have any loyalty points!");
                return;
            }

            const response = await fetch(import.meta.env.VITE_EXCHANGE_API_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            const exchangeRate = data.conversion_rates[userInfo.walletcurrency];
            const pointsInWallet = userInfo.loyaltyPoints * 0.01 * exchangeRate;

            await axios.put(`/tourist/${userId}`, {
                wallet: userInfo.wallet + pointsInWallet,
                loyaltyPoints: 0
            });

            setUserInfo(prev => ({
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

    const handleGuidePageClick = () => {
        navigate('/GuidePage', { state: { userId } });
    };

    if (!userId) {
        return <div className="text-center p-5">Loading...</div>;
    }

    return (
        <div className={styles.profileWrapper}>
            <ProfileSideBar userId={userId} userInfo={userInfo} />
            
            <Header />
            
            <main className={`${styles.mainContent} container-fluid`}>
                <div className={styles.patternOverlay} />
                <div className={`${styles.profileCard} card shadow`}>
                    <div className="row g-0">
                        <div className="col-md-4 text-center p-4 bg-primary text-white">
                            <img
                                src={userInfo.photo || "https://via.placeholder.com/150"}
                                alt="Profile"
                                className={`${styles.profileImage} mb-3`}
                            />
                            <h4 className="fw-bold">{userInfo.username}</h4>
                            <p className="mb-0">{userInfo.email}</p>
                        </div>

                        <div className="col-md-8">
                            <div className={`${styles.infoSection} card-body`}>
                                <h5 className="card-title text-primary mb-4">
                                    Welcome, {userInfo.username}!
                                </h5>
                                <div className="mb-3">
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
                                </div>
                                
                                {userInfo.role === "Tourist" && (
                                    <div className="mt-4">
                                        <button
                                            className={`btn btn-success ${styles.cashInButton}`}
                                            onClick={handleCashInPoints}
                                            disabled={userInfo.loyaltyPoints === 0}
                                        >
                                            Cash in Points
                                        </button>
                                        <button
                                            className={`btn btn-success ${styles.guideButton}`}
                                            onClick={handleGuidePageClick}
                                        >
                                            Guide Page
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