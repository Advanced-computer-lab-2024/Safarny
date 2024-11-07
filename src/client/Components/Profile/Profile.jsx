import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";
import Footer from "/src/client/components/Footer/Footer";
import Header from "/src/client/components/Header/Header";

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {}; // Get userId from location state if it exists
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    role: "",
    image: "",
  });

  const [showButtons, setShowButtons] = useState(false);

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

  const handleViewButtonClick = () => {
    setShowButtons((prevShow) => !prevShow);
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

  const handleDeleteTransportClick = () => {
    navigate("/transportss/delete-transport", { state: { userId } });
  };

  return (
    <div className={styles.container}>
      <Header />

        <main className={styles.main}>
        <section className={styles.intro}>
          <h1>Welcome, {userInfo.username}!</h1>
          <h5>Your account details:</h5>
          {userInfo.role === "TourismGovernor" ? (
            // Render specific details for "TourismGovernor"
            <>
              <p>Username: {userInfo.username}</p>
              <p>Email: {userInfo.email}</p>
              <p>Role: {userInfo.role}</p>
            </>
          ) : (
            // Render all other account details except the image
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

    {userInfo.role === "Tourist" && (
        <>
          <button
            onClick={handleBookFlight}
            className={styles.createPlaceButton}
          >
            Book A Flight
          </button>
          <button
            onClick={handleBookHotel}
            className={styles.createTagButton}
          >
            Book A Hotel
          </button>
        </>
      )}

      {userInfo.role === "Seller" && (
        <>
          <button onClick={handlePostClick} className={styles.postButton}>
            Post
          </button>
          <button onClick={handleSellerHomeClick} className={styles.postButton}>
            Seller Home
          </button>
        </>
      )}

      {userInfo.role === "Advertiser" && (
        <>
          <button onClick={handleAddActivity} className={styles.postButton}>
            Activity
          </button>
          <button onClick={handleCreateTransportClick} className={styles.postButton}>
            Create Transport
          </button>
          <button onClick={handleEditTransportClick} className={styles.postButton}>
            Edit Transport
          </button>
          <button onClick={handleDeleteTransportClick} className={styles.postButton}>
            Delete Transport
          </button>
        </>
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
            View Wishlist
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
