import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import styles from "./Profile.module.css";
import Footer from "/src/client/Components/Footer/Footer";
import Header from "/src/client/Components/Header/Header";
import ProfileSideBar from "../ProfileSideBar/ProfileSideBar";
import axios from "axios";
import Calendar from './Calendar';

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
    totalLoyaltyPoints: 0,
    wallet: 0,
    walletcurrency: "EGP"
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  const audioRef = useRef(null); // Define audioRef using useRef
  const [userBookings, setUserBookings] = useState([]);
  const [posts, setPosts] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [activities, setActivities] = useState([]);
  const [transports, setTransports] = useState([]);
  const [places, setPlaces] = useState([]);
  const [filteredRevenue, setFilteredRevenue] = useState(0);
  const [advertiserFilteredRevenue, setAdvertiserFilteredRevenue] = useState(0);

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
  const lastPromoDate = new Date(userData.lastPromoDate || 0); // Default to epoch if not set

  console.log("Today:", today, "User birthday:", userBirthday, "Last promo date:", lastPromoDate);

  if (
    today.getMonth() === userBirthday.getMonth() &&
    today.getDate() === userBirthday.getDate() &&
    (lastPromoDate.getFullYear() < today.getFullYear() ||
      lastPromoDate.getMonth() !== today.getMonth() ||
      lastPromoDate.getDate() !== today.getDate())
  ) {
    // Fetch promo codes
    const promoResponse = await axios.get('/promocodes/promocodes');
    if (!promoResponse.data || promoResponse.data.length === 0) {
      console.log("No promo codes available");
      return;
    }
    const promoCodes = promoResponse.data;

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

    // Add promo code to user's array of promos and update lastPromoDate
    await axios.put(`/tourist/${userId}`, {
      promos: [...userData.promos, randomPromoCode._id],
      lastPromoDate: today.toISOString()
    });

    console.log("Promo code added to user's promos and lastPromoDate updated");
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

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const response = await fetch(`/booking/get-bookings-by-tourist/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch bookings');
        const data = await response.json();
        setUserBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    if (userId) {
      fetchUserBookings();
    }
  }, [userId]);

  useEffect(() => {
    const fetchRoleSpecificData = async () => {
      if (!userId) return;

      try {
        const currentDate = new Date();
        const currentMonth = (currentDate.getMonth() + 1).toString();
        const currentYear = currentDate.getFullYear().toString();

        if (userData.role === "TourGuide") {
          const itinerariesResponse = await axios.get(
            `/tourguide/get-my-tourguide-itineraries/${userId}`
          );
          setItineraries(itinerariesResponse.data);
          
          // Get monthly sales for tour guide
          const salesResponse = await fetch(
            `/tourguide/reportsales/${userId}?month=${currentMonth}&year=${currentYear}`
          );
          const salesData = await salesResponse.json();
          setFilteredRevenue(salesData.totalRevenue);
        }
        
        else if (userData.role === "Advertiser") {
          const transportsResponse = await axios.get(
            `/transport/transports/advertiser/${userId}`
          );
          setTransports(transportsResponse.data);
          
          // Get monthly sales for advertiser
          const salesResponse = await fetch(
            `/advertiser/reportsales/${userId}?month=${currentMonth}&year=${currentYear}`
          );
          const salesData = await salesResponse.json();
          setAdvertiserFilteredRevenue(salesData.totalRevenue);
        }
        
        else if (userData.role === "Seller") {
          const postsResponse = await axios.get(`/seller/products/${userId}`);
          setPosts(postsResponse.data);
          
          const revenueResponse = await axios.get(
            `/seller/filteredRevenueByseller/${userId}?month=${currentMonth}&year=${currentYear}`
          );
          setFilteredRevenue(revenueResponse.data.totalRevenue);
        }
        
        else if (userData.role === "TourismGovernor") {
          const placesResponse = await axios.get("/toursimgovernor/places");
          setPlaces(placesResponse.data);
        }
      } catch (error) {
        console.error("Error fetching role-specific data:", error);
      }
    };

    fetchRoleSpecificData();
  }, [userId, userData.role]);

  console.log("Current userData state:", userData);

  const handleGuidePage = () => {
    navigate('/GuidePage', { state: { userId } });
  };

  const handleCashInPoints = async () => {
    try {
      if (userData.loyaltyPoints === 0) {
        setMessage("You do not have any loyalty points!");
        return;
      }

      // Add loading state while processing
      setMessage("Processing...");

      // 1. First issue: Missing API endpoint
      const response = await fetch(import.meta.env.VITE_EXCHANGE_API_URL);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const exchangeRate = data.conversion_rates[userData.walletcurrency];
      const pointsInWallet = userData.loyaltyPoints * 0.01 * exchangeRate;

      // 2. Second issue: Update user endpoint
      const updateResponse = await axios.put(`/tourist/${userId}`, {  // Changed endpoint
        wallet: userData.wallet + pointsInWallet,
        loyaltyPoints: 0
      });

      // 3. Check if update was successful
      if (updateResponse.status !== 200) {
        throw new Error('Failed to update user data');
      }

      // 4. Update local state only after successful API call
      setUserData(prev => ({
        ...prev,
        wallet: Number(prev.wallet + pointsInWallet),  // Ensure number type
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
                    <strong>Current Loyalty Points:</strong> {userData.loyaltyPoints}

                  </p>
                  <p className="card-text">
                    <strong>Total Loyalty Points:</strong> {userData.totalLoyaltyPoints}

                  </p>
                  <p className="card-text">
                    <strong>Loyalty Badge:</strong>{" "}
                    <img
                        src={
                          userData.totalLoyaltyPoints >= 500000 ? "/src/client/assets/Img/rank3.jpg" :
                              userData.totalLoyaltyPoints >= 100000 ? "/src/client/assets/Img/rank2.jpg" :
                                  "/src/client/assets/Img/rank1.jpg"
                        }
                        alt="Loyalty Badge"
                        className={styles.loyaltyBadgeImage}
                        style={{
                          width: '30px',
                          height: '30px',
                          marginLeft: '10px',
                          verticalAlign: 'middle'
                        }}
                    />
                    <span style={{marginLeft: '10px', fontSize: '0.9em', color: '#666'}}>
                      {userData.totalLoyaltyPoints >= 500000 ? "Level 3" :
                          userData.totalLoyaltyPoints >= 100000 ? "Level 2" :
                              "Level 1"}
                    </span>
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
                      style={{ 
                        position: 'relative', 
                        zIndex: 1000, 
                        cursor: 'pointer'
                      }}
                    >
                      Cash in Points
                    </button>

                    <button
                      className={`btn btn-success ${styles.guideButton}`}
                      onClick={handleGuidePage}
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

        <div className="row mt-4 px-4">
          {/* Loyalty Progress Card */}
          <div className="col-12 mb-4">
            <div className={`${styles.card} p-4`}>
              <h5 className="mb-3">Loyalty Progress</h5>
              <div className={styles.progressWrapper}>
                <div className={styles.progressStages}>
                  {/* Level 1 Stage (0-100K) */}
                  <div className={styles.progressStage}>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill} 
                        style={{ 
                          width: `${Math.min((userData.totalLoyaltyPoints / 100000) * 100, 100)}%`
                        }}
                      />
                    </div>
                    <span>Level 1</span>
                  </div>
                  
                  {/* Level 2 Stage (100K-500K) */}
                  <div className={`${styles.progressStage} ${userData.totalLoyaltyPoints >= 100000 ? styles.active : styles.inactive}`}>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill} 
                        style={{ 
                          width: userData.totalLoyaltyPoints >= 100000 ?
                            `${Math.min(((userData.totalLoyaltyPoints - 100000) / 400000) * 100, 100)}%` : '0%'
                        }}
                      />
                    </div>
                    <span>Level 2</span>
                  </div>
                </div>

                <div className={styles.levelInfo}>
                  <div className={styles.currentLevel}>
                    <span className={styles.levelLabel}>Current Level:</span>
                    <span className={styles.levelValue}>
                      {userData.totalLoyaltyPoints >= 500000 ? "Level 3" :
                       userData.totalLoyaltyPoints >= 100000 ? "Level 2" : "Level 1"}
                    </span>
                  </div>
                  <div className={styles.pointsNeeded}>
                    {userData.totalLoyaltyPoints >= 500000 ? (
                      <span className={styles.maxLevel}>Maximum level achieved! 🎉</span>
                    ) : (
                      <>
                        <span className={styles.pointsLabel}>Points needed for next level:</span>
                        <span className={styles.pointsValue}>
                          {userData.totalLoyaltyPoints >= 100000
                            ? `${(500000 - userData.totalLoyaltyPoints).toLocaleString()} points to Level 3`
                            : `${(100000 - userData.totalLoyaltyPoints).toLocaleString()} points to Level 2`}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Spending Summary - Full width for better layout */}
          <div className="col-12 mb-4">
            <div className={`${styles.card} p-4`}>
              <h5 className="mb-3">Spending Summary</h5>
              <div className={styles.summaryStats}>
                <div className={styles.statItem}>
                  <div className="d-flex align-items-center">
                    <i className="fas fa-wallet me-3"></i>
                    <div>
                      <h6 className="mb-1">Wallet Balance</h6>
                      <span className="fs-5">{userData.wallet?.toFixed(2)} {userData.walletcurrency}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <div className="d-flex align-items-center">
                    <i className="fas fa-star me-3"></i>
                    <div>
                      <h6 className="mb-1">Total Loyalty Points</h6>
                      <span className="fs-5">{userData.totalLoyaltyPoints}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Role-Specific Cards */}
          {userData.role === "Tourist" && (
            <>
              <div className="col-md-6 mb-4">
                <div className={`${styles.card} p-4 h-100`}>
                  <h5 className="mb-3">Upcoming Bookings</h5>
                  <Calendar bookings={userBookings} />
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className={`${styles.card} p-4 h-100`}>
                  <h5 className="mb-3">Travel Planning</h5>
                  <div className={styles.quickActions}>
                    <button className={styles.actionButton} onClick={() => navigate('/BookFlight', { state: { userId } })}>
                      <i className="fas fa-plane"></i>
                      Book Flight
                    </button>
                    <button className={styles.actionButton} onClick={() => navigate('/BookHotel', { state: { userId } })}>
                      <i className="fas fa-hotel"></i>
                      Book Hotel
                    </button>
                    <button className={styles.actionButton} onClick={() => navigate('/myorders', { state: { userId } })}>
                      <i className="fas fa-shopping-bag"></i>
                      My Orders
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {userData.role === "TourGuide" && (
            <>
              <div className="col-md-6 mb-4">
                <div className={`${styles.card} p-4 h-100`}>
                  <h5 className="mb-3">Tour Overview</h5>
                  <div className={styles.statsGrid}>
                    <div className={styles.statBox}>
                      <i className="fas fa-route"></i>
                      <div>
                        <h6>Active Itineraries</h6>
                        <span>{itineraries.length}</span>
                      </div>
                    </div>
                    <div className={styles.statBox}>
                      <i className="fas fa-dollar-sign"></i>
                      <div>
                        <h6>Monthly Sales</h6>
                        <span>${filteredRevenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {userData.role === "Advertiser" && (
            <>
              <div className="col-md-6 mb-4">
                <div className={`${styles.card} p-4 h-100`}>
                  <h5 className="mb-3">Transport Overview</h5>
                  <div className={styles.statsGrid}>
                    <div className={styles.statBox}>
                      <i className="fas fa-bus"></i>
                      <div>
                        <h6>Active Transports</h6>
                        <span>{transports.length}</span>
                      </div>
                    </div>
                    <div className={styles.statBox}>
                      <i className="fas fa-dollar-sign"></i>
                      <div>
                        <h6>Monthly Sales</h6>
                        <span>${advertiserFilteredRevenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {userData.role === "Seller" && (
            <>
              <div className="col-md-6 mb-4">
                <div className={`${styles.card} p-4 h-100`}>
                  <h5 className="mb-3">Sales Dashboard</h5>
                  <div className={styles.statsGrid}>
                    <div className={styles.statBox}>
                      <i className="fas fa-shopping-cart"></i>
                      <div>
                        <h6>Active Listings</h6>
                        <span>{posts.length}</span>
                      </div>
                    </div>
                    <div className={styles.statBox}>
                      <i className="fas fa-dollar-sign"></i>
                      <div>
                        <h6>Monthly Sales</h6>
                        <span>${filteredRevenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {userData.role === "TourismGovernor" && (
            <>
              <div className="col-md-6 mb-4">
                <div className={`${styles.card} p-4 h-100`}>
                  <h5 className="mb-3">Region Overview</h5>
                  <div className={styles.statsGrid}>
                    <div className={styles.statBox}>
                      <i className="fas fa-landmark"></i>
                      <div>
                        <h6>Historical Sites</h6>
                        <span>{places.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;