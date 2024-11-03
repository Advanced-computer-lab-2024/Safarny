import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Logo from '/src/client/Assets/Img/logo.png';
import Footer from '/src/client/components/Footer/Footer';
import styles from './ReadHistoricalPlace.module.css'; // Import the CSS module
import styles1 from '/src/client/components/Home/Homepage.module.css';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

const ReadHistoricalPlace = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openingHoursFilter, setOpeningHoursFilter] = useState('');
  const [tagFilter, setTagFilter] = useState(''); // Define tagFilter state
  const [userInfo, setUserInfo] = useState({ role: '', userId: '' }); // Define userInfo state with userId
  const [filterByGovernor, setFilterByGovernor] = useState(false); // Define filterByGovernor state
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {}; // Retrieve userId from location state

  const fetchHistoricalPlaces = async () => {
    try {
      const response = await axios.get('http://localhost:3000/toursimgovernor/places');
      const placesData = response.data;

      if (Array.isArray(placesData)) {
        setPlaces(placesData);
      } else {
        console.error("Expected an array, but got:", typeof placesData);
        setError('Invalid data format received');
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching historical places:', err);
      setError('Failed to fetch historical places');
      setLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/tourist/${userId}`); // Adjust the URL as needed
      setUserInfo(response.data);
      console.log(userInfo.role);
    } catch (err) {
      console.error('Error fetching user info:', err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserInfo();
    }
    fetchHistoricalPlaces();
  }, [userId]);

  const fetchHistoricalPlacesByGovernor = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/toursimgovernor/places/governor/${userInfo.userId}`);
      const placesData = response.data;

      if (Array.isArray(placesData)) {
        const filteredPlaces = placesData.filter(place => place.createdby); // Ensure the place has a createdby field
        setPlaces(filteredPlaces);
      } else {
        console.error("Expected an array, but got:", typeof placesData);
        setError('Invalid data format received');
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching historical places:', err);
      setError('Failed to fetch historical places');
      setLoading(false);
    }
  };
  const handleFilterByGovernor = () => {
    setFilterByGovernor(prev => !prev);
  };

  useEffect(() => {
    if (filterByGovernor) {
      fetchHistoricalPlacesByGovernor();
    } else {
      fetchHistoricalPlaces();
    }
  }, [filterByGovernor]);

  // Handle filtering historical places based on search term, opening hours, and tag
  const filteredPlaces = places.filter(place =>
    place.description && place.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (openingHoursFilter ? place.openingHours.toLowerCase().includes(openingHoursFilter.toLowerCase()) : true) &&
    (tagFilter ? place.tags.some(tag => tag.name.toLowerCase().includes(tagFilter.toLowerCase())) : true)
  );

  // Handle updating historical places
  const handleUpdateHistoricalPlace = (placeId) => {
    navigate(`/update-historical-place/${placeId}`); // Redirect to update page
  };
  const handleReadHistoricalPlaceDetails = (placeId) => {
    navigate(`/historical-place/${placeId}`); // Redirect to details page
  }
  // Handle deleting historical places
  const handleDeleteHistoricalPlace = async (placeId) => {
    try {
      await axios.delete(`http://localhost:3000/toursimgovernor/places/${placeId}`);
      // Update the state to remove the deleted place
      setPlaces(prevPlaces => prevPlaces.filter(place => place._id !== placeId));
    } catch (err) {
      console.error('Error deleting historical place:', err);
      setError('Failed to delete historical place');
    }
  };

  if (loading) {
    return <p>Loading historical places...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles1.container}>
      <header className={styles1.header}>
        <img src={Logo} alt="Safarny Logo" className={styles1.logo} />
        <h1>Safarny</h1>
        <nav className={styles.nav}>
          <Link to="/" className={styles.button}>Back to Home</Link>
        </nav>
      </header>
      <h1>Historical Places</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by description..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />

      {/* Opening Hours Filter */}
      <div className={styles.openingHoursFilter}>
        <label>Filter by opening hours:</label>
        <input
          type="text"
          placeholder="e.g. monday 12:00 AM - 5:00 PM"
          value={openingHoursFilter}
          onChange={(e) => setOpeningHoursFilter(e.target.value)}
          className={styles.openingHoursInput}
        />
      </div>

      {/* Tag Filter */}
      <div className={styles.tagFilter}>
        <label>Filter by tag:</label>
        <input
          type="text"
          placeholder="e.g., historical"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className={styles.tagInput}
        />
      </div>

      {/* Filter by Governor Button */}
      {userInfo.role === 'TourismGovernor' && (
        <button onClick={handleFilterByGovernor} className={styles.filterButton}>
          {filterByGovernor ? 'Show All Places' : 'Show My Places'}
        </button>
      )}

      {filteredPlaces.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {filteredPlaces.map(place => {
            const hasCoordinates = place.coordinates && place.coordinates.lat !== undefined && place.coordinates.lng !== undefined;
            return (
              <div className={styles.placeCard} key={place._id}>
                <h2 className={styles.placeName}>{place.description}
                  <br/>
                  <button onClick={() => handleReadHistoricalPlaceDetails(place._id)} className={styles.viewButton}>
                    View Details
                  </button>
                  <button
                      onClick={() => navigator.clipboard.writeText(`${window.location.origin}/historical-place/${place._id}`)}
                      className={styles.copyButton}
                  >
                    Copy link
                  </button>
                  <button
                      onClick={() => window.location.href = `mailto:?subject=Check out this historical place&body=${window.location.origin}/historical-place/${place._id}`}
                      className={styles.emailButton}
                  >
                    Send by Email
                  </button>
                </h2>
                <p>Opening Hours: {place.openingHours}</p>
                <p>Description: {place.description}</p>
                <p>Ticket Price: {place.ticketPrices} {place.currency}</p>
                {place.tags && place.tags.length > 0 ? (
                  <p>Tags: {place.tags.map(tag => tag.name).join(', ')}</p> // Map to get tag names
                ) : (
                  <p>No tags available</p>
                )}
                {place.pictures && place.pictures.length > 0 && (
                  <img className={styles.placeImage} src={place.pictures[0]} alt={place.description} />
                )}
                {/* Map Container */}
                <div className={styles.mapContainer}>
                  {hasCoordinates ? (
                      <MapContainer
                          center={[place.coordinates.lat, place.coordinates.lng]}
                          zoom={13}
                          style={{height: '100%', width: '100%'}}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        <Marker position={[place.coordinates.lat, place.coordinates.lng]}/>
                      </MapContainer>

                  ) : (
                      <p>Coordinates not available</p>
                  )}
                </div>
                {/* Update and Delete Buttons */}
                {userInfo.role === 'TourismGovernor' && (
                    <>
                      <button onClick={() => handleUpdateHistoricalPlace(place._id)} className={styles.updateButton}>
                      Update
                    </button>
                    <button onClick={() => handleDeleteHistoricalPlace(place._id)} className={styles.deleteButton}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p>No historical places available</p>
      )}
      <Footer />
    </div>
  );
};

export default ReadHistoricalPlace;