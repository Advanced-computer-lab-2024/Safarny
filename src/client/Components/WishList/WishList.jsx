import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Footer from '/src/client/components/Footer/Footer';
import styles from './WishList.module.css';
import Header from '/src/client/components/Header/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMoon, FiSun, FiShoppingCart, FiHeart, FiTrash2 } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WishList = () => {
  const location = useLocation();
  const { userId } = location.state;
  const [wishList, setWishList] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isGridView, setIsGridView] = useState(true);

  useEffect(() => {
    const fetchWishList = async () => {
      try {
        const response = await axios.get(`/wishlist/${userId}`);
        setWishList(response.data.items || []);
      } catch (error) {
        toast.error('Failed to load wishlist');
        setError('Your wishlist is empty');
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
      toast.success('Item removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleAddToCartClick = async (product) => {
    try {
      const profileResponse = await axios.get(`http://localhost:3000/tourist/${userId}`);
      const currentCart = profileResponse.data.cart || [];
      const updatedCart = [...currentCart, product._id];

      await axios.put(`http://localhost:3000/tourist/${userId}`, {
        id: userId,
        cart: updatedCart,
      });

      toast.success('Added to cart successfully!');
    } catch (err) {
      toast.error('Failed to add to cart');
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle(styles.darkMode);
  };

  if (loading) {
    return (
      <div className={`${styles.container} ${isDarkMode ? styles.darkMode : ''}`}>
        <Header />
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.darkMode : ''}`}>
      <Header />
      <ToastContainer position="top-right" theme={isDarkMode ? 'dark' : 'light'} />
      
      <div className={styles.controls}>
        <button 
          className={styles.themeToggle}
          onClick={toggleDarkMode}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <FiSun /> : <FiMoon />}
        </button>
        <button 
          className={styles.viewToggle}
          onClick={() => setIsGridView(!isGridView)}
          aria-label="Toggle view"
        >
          {isGridView ? '📋' : '📱'}
        </button>
      </div>

      <main className={styles.main}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.title}
        >
          My Wishlist
        </motion.h1>

        {wishList.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.emptyState}
          >
            <FiHeart size={48} />
            <p>Your wishlist is empty</p>
            <Link to="/shop" className={styles.shopButton}>
              Explore Products
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            className={`${styles.productGrid} ${!isGridView ? styles.listView : ''}`}
            layout
          >
            <AnimatePresence>
              {wishList.map(item => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  className={styles.productCard}
                >
                  <div className={styles.productImage}>
                    <img src={item.imageurl} alt={item.title} loading="lazy" />
                  </div>
                  
                  <div className={styles.productInfo}>
                    <h2>{item.details}</h2>
                    <div className={styles.productMeta}>
                      <span className={styles.price}>{item.price}</span>
                      <span className={styles.quantity}>Qty: {item.quantity}</span>
                    </div>
                    
                    <div className={styles.rating}>
                      {'★'.repeat(Math.floor(item.rating))}
                      {'☆'.repeat(5 - Math.floor(item.rating))}
                    </div>
                  </div>

                  <div className={styles.productActions}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={styles.cartButton}
                      onClick={() => handleAddToCartClick(item)}
                    >
                      <FiShoppingCart /> Add to Cart
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={styles.removeButton}
                      onClick={() => handleRemove(item._id)}
                    >
                      <FiTrash2 /> Remove
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default WishList;