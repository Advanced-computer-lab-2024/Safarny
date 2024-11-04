import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";
import Footer from "/src/client/components/Footer/Footer";
import Header from "/src/client/components/Header/Header";

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state;
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    role: "",
    image: "", // Added image field
  });

  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    console.log("profile id",userId);
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/tourist/profile?id=${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const { password, __v, _id, imageurl, ...userData } =
          await response.json();
        setUserInfo({ ...userData, image: imageurl }); // Ensure image is set correctly
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleUpdateClick = () => {
    localStorage.setItem("userId", userId);
    window.location.href = "/UpdateProfile";
  };

  const handleProductViewClick = () => {
    localStorage.setItem("userId", userId);
    window.location.href = "/products";
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

  const handleUpdateClick2 = () => {
    navigate("/Search");
  };

  const handleViewButtonClick = () => {
    setShowButtons((prevShow) => !prevShow);
  };

  const handleUpcomingActivitiesClick = () => {
    navigate("/UpcomingActivites");
  };

  const handleUpcomingItinerariesClick = () => {
    navigate("/UpcomingItineraries");
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
  }

  

  /*const handleViewPurchasedProducts = () => {
    navigate("/PurchasedProducts", { state: { userId } });
  };
  <button onClick={handleViewPurchasedProducts} className={styles.searchButton}>
          View Purchased Products
        </button>
         */

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <section className={styles.intro}>
          <h1>Welcome, {userInfo.username}!</h1>
          <h5>Your account details:</h5>
          {Object.entries(userInfo)
            .filter(([key]) => key !== "image") // Exclude the image key
            .map(([key, value]) => (
              <p key={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
              </p>
            ))}
          {userInfo.image && ( // Display the profile image if available
            <img
              src={userInfo.image}
              alt="Profile"
              className={styles.profileImage}
            />
          )}
        </section>
      </main>

      <div className={styles.buttonContainer}>
        <button
          onClick={handleProductViewClick}
          className={styles.productButton}
        >
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
        <>
          <button
            onClick={handleCreateHistoricalPlaceClick}
            className={styles.createPlaceButton}
          >
            Create Historical Place
          </button>
          <button
            onClick={handleCreateHistoricalTagClick}
            className={styles.createTagButton}
          >
            Create Historical Tag
          </button>
        </>
      )}

      {userInfo.role === "Seller" && (
        <button onClick={handlePostClick} className={styles.postButton}>
          Post
        </button>
      )}
      {userInfo.role === "Seller" && (
        <button onClick={handleSellerHomeClick} className={styles.postButton}>
          Seller Home
        </button>
      )}

      {userInfo.role === "Advertiser" && (
        <button onClick={handleAddActivity} className={styles.postButton}>
          Activities
        </button>
      )}

      {userInfo.role === "TourGuide" && (
        <button onClick={handleAddItinerary} className={styles.postButton}>
          Add Itinerary
        </button>
      )}

      {userInfo.role === "Tourist" && (
          <div>
            <button onClick={handleCreateComplaint} className={styles.postButton}>
              Create Complaint
            </button>
            <button onClick={handleViewComplaints} className={styles.postButton}>
              View Complaints
            </button>
            <button onClick={handelWishList} className={styles.postButton}>
              View Wish List
            </button>
          </div>
      )}

      <button onClick={handleViewButtonClick} className={styles.mainButton}>
        View Upcoming Events
      </button>

      {showButtons && (
        <div className={styles.buttonGroup}>
          <button
            className={styles.subButton}
            onClick={handleUpcomingActivitiesClick}
          >
            Upcoming Activities
          </button>
          <button
            className={styles.subButton}
            onClick={handleUpcomingItinerariesClick}
          >
            Upcoming Itineraries
          </button>
          <button
            className={styles.subButton}
            onClick={handleViewHistoricalPlacesClick}
          >
            Upcoming Historical Places
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Profile;
