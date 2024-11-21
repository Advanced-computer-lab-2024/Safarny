import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Footer from '/src/client/components/Footer/Footer';
import Header from '/src/client/components/Header/Header';
import styles from './MyCart.module.css';
import StarRatings from 'react-star-ratings';

const Cart = () => {
  const location = useLocation();
  const { userId } = location.state || {};
  const touristId = userId || localStorage.getItem('userId');
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletCurrency, setWalletCurrency] = useState('USD'); // Default to USD
  const [exchangeRates, setExchangeRates] = useState({});

  useEffect(() => {
    const fetchUserWalletCurrency = async () => {
      try {
        const response = await axios.get(`/user/${touristId}/wallet`);
        setWalletCurrency(response.data.currency);
      } catch (err) {
        console.error('Error fetching wallet currency:', err);
      }
    };

    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        setExchangeRates(response.data.rates);
      } catch (err) {
        console.error('Error fetching exchange rates:', err);
      }
    };

    fetchUserWalletCurrency();
    fetchExchangeRates();
  }, [touristId]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`/tourist/${touristId}`);
        const cartIds = response.data?.cart || [];

        if (cartIds.length > 0) {
          const productDetails = await Promise.all(
            cartIds.map(async (cartId) => {
              try {
                const productResponse = await axios.get(`/admin/products/${cartId}`);
                return productResponse.data;
              } catch (err) {
                if (err.response && err.response.status === 404) {
                  console.warn(`Product with ID ${cartId} not found.`);
                  return null; // Return null if product is not found
                } else {
                  throw err; // Re-throw other errors
                }
              }
            })
          );

          const validCartItems = productDetails.filter((item) => item !== null);
          setCartItems(validCartItems);

          if (validCartItems.length === 0) {
            setError('No items in the cart for this user.');
          }
        } else {
          setError('No items in the cart for this user.');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cart items:', err);
        setError('Failed to fetch cart items');
        setLoading(false);
      }
    };

    if (touristId) {
      fetchCartItems();
    }
  }, [touristId]);

  const convertPrice = (price, fromCurrency, toCurrency) => {
    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
      console.error('Exchange rates not available for the given currencies');
      return price;
    }
    const rateFrom = exchangeRates[fromCurrency];
    const rateTo = exchangeRates[toCurrency];
    return ((price / rateFrom) * rateTo).toFixed(2);
  };
  const handleRemoveFromCart = async (product) => {
    try {
      console.log("User ID: ", userId);
      // Fetch the user's current cart
      const profileResponse = await axios.get(`http://localhost:3000/tourist/${userId}`);
      const currentCart = profileResponse.data.cart || [];
  
      // Remove the product ID from the cart
      const updatedCart = currentCart.filter(id => id !== product._id);
  
      // Update the user's profile with the updated cart
      await axios.put(`http://localhost:3000/tourist/${userId}`, {
        id: userId,
        cart: updatedCart,
      });
  
      // Update the state locally to reflect the removal
      setCartItems(cartItems.filter(item => item._id !== product._id));
    } catch (err) {
      console.error('Error removing product from cart:', err);
    }
  };
  

  if (loading) {
    return <p>Loading cart items...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles.container}>
      <Header />
      <h1 className={styles.headerTitle}>My Cart</h1>
      {cartItems.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {cartItems.map((item) => {
            const convertedPrice = convertPrice(item.price, item.currency, walletCurrency);
            const averageRating =
              item.rating.length > 0
                ? (item.rating.reduce((acc, val) => acc + val, 0) / item.rating.length).toFixed(1)
                : 0;
            return (
              <div className={styles.productCard} key={item._id}>
                <h2 className={styles.productDetails}>{item.details}</h2>
                <p>Price: {convertedPrice} {walletCurrency}</p>
                <p>Quantity: {item.quantity}</p>
                <div className={styles.ratingContainer}>
                  <StarRatings
                    rating={Math.round(averageRating * 2) / 2}
                    starRatedColor="gold"
                    numberOfStars={5}
                    starDimension="20px"
                    starSpacing="2px"
                    name="rating"
                  />
                  <p>{averageRating} out of 5</p>
                </div>
                
                
                <img className={styles.productImage} src={item.imageurl} alt={item.details} />
                <button
                  className={styles.button}
                  onClick={() => handleRemoveFromCart(item)}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No items in the cart available</p>
      )}
      <Footer />
    </div>
  );
};

export default Cart;
