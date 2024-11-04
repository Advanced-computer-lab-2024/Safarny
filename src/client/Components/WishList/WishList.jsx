import React, { useState, useEffect } from 'react';
import {Link, useLocation} from 'react-router-dom';
import axios from 'axios';
import Footer from '/src/client/components/Footer/Footer';
import styles from './WishList.module.css';
import Header from "/src/client/components/Header/Header";

const WishList = () => {
  const location = useLocation();
  const { userId } = location.state;
  const [wishList, setWishList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWishList = async () => {
      try {
        const response = await axios.get(`/wishlist/${userId}`);
        setWishList(response.data.items);
      } catch (error) {
        setError('Failed to fetch wishlist');
        console.log('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishList();
  }, [userId]);

  const handleRemove = async (postId) => {
    try {
      await axios.post('/wishlist/remove', { userId, postId });
      setWishList(wishList.filter(item => item._id !== postId));
    } catch (error) {
      setError('Failed to remove item from wishlist');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className={styles.container}>
      <Header />
      <h1>My Wishlist</h1>
      {wishList.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {wishList.map(item => (
            <div className={styles.productCard} key={item._id}>
              <h2 className={styles.productDetails}>{item.title}</h2>
              <p>Content: {item.content}</p>
              <p>Price: {item.price}</p>
              <p>Currency: {item.currency}</p>
              <p>Quantity: {item.quantity}</p>
              <img className={styles.productImage} src={item.imageurl} alt={item.title} />
              <button
                onClick={() => handleRemove(item._id)}
                className={styles.wishlistButton}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default WishList;