import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Footer from '/src/client/components/Footer/Footer';
import Header from '/src/client/components/Header/Header';
import styles from './PurchasedProducts.module.css';

const PurchasedProducts = () => {
  const location = useLocation();
  const { userId } = location.state || {};
  const [searchParams] = useSearchParams();
  const touristId = userId || localStorage.getItem('userId');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState({});
  const [ratings, setRatings] = useState({});
  const [tempReviews, setTempReviews] = useState({}); // Temporarily holds input text
  const [walletCurrency, setWalletCurrency] = useState('USD'); // Default to USD
  const [exchangeRates, setExchangeRates] = useState({});
  const [userRole, setUserRole] = useState('');
  const [wallet, setWallet] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState(walletCurrency);
  useEffect(() => {
    const fetchUserWalletCurrency = async () => {
      try {
        const response = await axios.get(`/user/${touristId}/wallet`);
        setWalletCurrency(response.data.currency);
      } catch (err) {
        console.error('Error fetching wallet currency:', err);
      }
    };
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(`/tourist/${userId}`);
        const user = response.data;
        setUserRole(user.role);
        setWallet(user.wallet);
        setWalletCurrency(user.walletcurrency || 'EGP');
        setSelectedCurrency(user.walletcurrency || 'EGP'); // Set selectedCurrency to walletCurrency
        console.log('User role:', user.role);
      } catch (err) {
        console.error('Error fetching user role:', err);
      }
    };
    fetchUserRole();
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
    const fetchPurchasedProducts = async () => {
      try {
        const response = await axios.get(`/tourist/${touristId}`);
        const postIds = response.data?.posts || [];

        if (postIds.length > 0) {
          const productDetails = await Promise.all(
              postIds.map(async (postId) => {
                const productResponse = await axios.get(`/admin/products/${postId}`);
                return productResponse.data;
              })
          );
          setProducts(productDetails);
        } else {
          setError('No purchased products found for this user.');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching purchased products:', err);
        setError('Failed to fetch purchased products');
        setLoading(false);
      }
    };

    if (touristId) {
      fetchPurchasedProducts();
    }
  }, [touristId]);

  const handleReviewChange = (productId, value) => {
    setReviews(prevReviews => {
      const currentReviews = prevReviews[productId] || [];
      const emptyIndex = currentReviews.findIndex(review => !review);
      const updatedReviews = [...currentReviews];

      if (emptyIndex !== -1) {
        updatedReviews[emptyIndex] = value;
      } else {
        updatedReviews.push(value);
      }

      return {
        ...prevReviews,
        [productId]: updatedReviews,
      };
    });
  };

  const handleRatingChange = (productId, value) => {
    setRatings(prevRatings => ({
      ...prevRatings,
      [productId]: value,
    }));
  };

  const handleSubmitReview = async (productId) => {
    const newReview = tempReviews[productId] || "";
    const userRating = ratings[productId];

    if (!userRating) {
      alert("Please add a rating before submitting a review.");
      return;
    }

    if (newReview.trim() !== "") {
      try {
        const response = await axios.get(`/admin/products/${productId}`);
        const product = response.data;

        if (!product) {
          alert("Product not found");
          return;
        }

        const currentReviews = product.reviews;
        const updatedReviews = [...currentReviews, newReview];

        await axios.put(`/admin/products/${productId}`, { reviews: updatedReviews });
        alert("Review submitted successfully!");

        setReviews(prevReviews => ({
          ...prevReviews,
          [productId]: updatedReviews
        }));

        setTempReviews(prevTempReviews => ({
          ...prevTempReviews,
          [productId]: ""
        }));

      } catch (err) {
        console.error("Error submitting review:", err);
        alert("Failed to submit review. Please try again.");
      }
    }
  };

  const handleTempReviewChange = (productId, value) => {
    setTempReviews(prevTempReviews => ({
      ...prevTempReviews,
      [productId]: value,
    }));
  };

  const handleSubmitRating = async (productId) => {
    const newRating = ratings[productId] || 0;

    if (newRating < 1 || newRating > 5) {
      alert("Rating should be between 1 and 5.");
      return;
    }

    try {
      const response = await axios.get(`/admin/products/${productId}`);
      const product = response.data;

      const updatedRatings = [...product.rating, newRating];

      await axios.put(`/admin/products/${productId}`, { rating: updatedRatings });

      alert("Rating submitted successfully!");
    } catch (err) {
      console.error("Error submitting rating:", err);
      alert("Failed to submit rating. Please try again.");
    }
  };

  const convertPrice = (price, fromCurrency, toCurrency) => {
    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
      console.error('Exchange rates not available for the given currencies');
      return price;
    }
    const rateFrom = exchangeRates[fromCurrency];
    const rateTo = exchangeRates[toCurrency];
    return ((price / rateFrom) * rateTo).toFixed(2);
  };

  if (loading) {
    return <p>Loading purchased products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
      <div className={styles.container}>
        <Header />
        <h1>Purchased Products</h1>

        {products.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {products.map(product => {
                const convertedPrice = convertPrice(product.price, product.currency, selectedCurrency);
                return (
                    <div className={styles.productCard} key={product._id}>
                      <h2 className={styles.productDetails}>{product.details}</h2>
                      <p>Price: {convertedPrice} {selectedCurrency}</p>
                      <p>Quantity: {product.quantity}</p>
                      <p>Ratings: {product.rating.length > 0 ? (product.rating.reduce((acc, val) => acc + val, 0) / product.rating.length).toFixed(1) : "No ratings yet"}</p>

                      <div className={styles.reviewsSection}>
                        <h3>Reviews:</h3>
                        {product.reviews && product.reviews.length > 0 ? (
                            <ul>
                              {product.reviews.map((review, index) => (
                                  <li key={index}>{review}</li>
                              ))}
                            </ul>
                        ) : (
                            <p>No reviews available</p>
                        )}
                      </div>
                      <img className={styles.productImage} src={product.imageurl} alt={product.details} />

                      <textarea
                          placeholder="Write your review..."
                          value={tempReviews[product._id] || ''}
                          onChange={(e) => handleTempReviewChange(product._id, e.target.value)}
                          className={styles.reviewInput}
                      />
                      <button onClick={() => handleSubmitReview(product._id)} className={styles.submitReviewButton}>
                        Submit Review
                      </button>

                      <select
                          value={ratings[product._id] || 0}
                          onChange={(e) => handleRatingChange(product._id, Number(e.target.value))}
                          className={styles.ratingSelect}
                      >
                        <option value={0}>Rate this product</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                      </select>
                      <button onClick={() => handleSubmitRating(product._id)} className={styles.submitRatingButton}>
                        Submit Rating
                      </button>
                    </div>
                );
              })}
            </div>
        ) : (
            <p>No purchased products available</p>
        )}
        <Footer />
      </div>
  );
};

export default PurchasedProducts;