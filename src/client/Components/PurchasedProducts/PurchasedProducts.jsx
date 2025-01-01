import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Footer from '/src/client/Components/Footer/Footer';
import Header from '/src/client/Components/Header/Header';
import styles from './PurchasedProducts.module.css';
import StarRatings from 'react-star-ratings';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container} from "react-bootstrap";
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';

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
       // console.log('Wallet fetched:', user.wallet);
       
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
          // Count occurrences of each product ID
          const idCounts = postIds.reduce((acc, id) => {
            acc[id] = (acc[id] || 0) + 1;
            return acc;
          }, {});

          // Fetch unique product details
          const uniqueProductDetails = await Promise.all(
              Object.keys(idCounts).map(async (postId) => {
                try {
                  const productResponse = await axios.get(`/admin/products/${postId}`);
                  return { ...productResponse.data, count: idCounts[postId] };
                } catch (err) {
                  if (err.response && err.response.status === 404) {
                    console.warn(`Product with ID ${postId} not found.`);
                    return null; // Return null if product is not found
                  } else {
                    throw err; // Re-throw other errors
                  }
                }
              })
          );

          // Filter out null products
          const validProducts = uniqueProductDetails.filter(product => product !== null);
          setProducts(validProducts);

          if (validProducts.length === 0) {
            setError('No purchased products found for this user.');
          }
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
        const updatedRatings = [...product.rating, userRating];

        await axios.put(`/admin/products/${productId}`, { reviews: updatedReviews, rating: updatedRatings });
        alert("Review and rating submitted successfully!");

        setReviews(prevReviews => ({
          ...prevReviews,
          [productId]: updatedReviews
        }));

        setTempReviews(prevTempReviews => ({
          ...prevTempReviews,
          [productId]: ""
        }));

        setRatings(prevRatings => ({
          ...prevRatings,
          [productId]: 0
        }));

      } catch (err) {
        console.error("Error submitting review and rating:", err);
        alert("Failed to submit review and rating. Please try again.");
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
  return (
      <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',  // Full viewport height
            width: '100vw',   // Full viewport width
          }}
      >
        <CircularProgress />
      </Box>
  );
}

  if (error) {
    return (
          <div className={styles.pageContainer}>
            <Header/>
            <Container fluid className={styles.mainContent}>
              <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50vh',  // Full viewport height
                    width: '71vw',   // Full viewport width
                  }}
              >
                {error}
              </Box>            </Container>
            <Footer/>
        </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerWrapper}>
        <Header />
      </div>
      <main className={styles.mainContent}>
        <h1 className="text-center mb-4">Purchased Products</h1>
        {products.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {products.map(product => {
              const convertedPrice = convertPrice(product.price, product.currency, selectedCurrency);
              const averageRating = product.rating.length > 0 ? (product.rating.reduce((acc, val) => acc + val, 0) / product.rating.length).toFixed(1) : 0;
              return (
                <div className="col" key={product._id}>
                  <div className="card h-100 shadow-sm">
                    <img className="card-img-top" src={product.imageurl} alt={product.details} style={{ height: '200px', objectFit: 'cover' }} />
                    <div className="card-body">
                      <h5 className="card-title">{product.details}</h5>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold">{convertedPrice} {selectedCurrency}</span>
                        <span className="badge bg-secondary">Qty: {product.count}</span>
                      </div>

                      <div className="mb-3">
                        <StarRatings
                          rating={Math.round(averageRating * 2) / 2}
                          starRatedColor="gold"
                          numberOfStars={5}
                          starDimension="20px"
                          starSpacing="2px"
                          name='rating'
                        />
                        <small className="ms-2">({averageRating} / 5)</small>
                      </div>

                      <div className="mb-3">
                        <h6>Reviews:</h6>
                        <div className="reviews-scroll" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                          {product.reviews && product.reviews.length > 0 ? (
                            <ul className="list-unstyled">
                              {product.reviews.map((review, index) => (
                                <li key={index} className="small mb-1">{review}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="small text-white">No reviews available</p>
                          )}
                        </div>
                      </div>

                      <textarea
                        className="form-control mb-2"
                        placeholder="Write your review..."
                        value={tempReviews[product._id] || ''}
                        onChange={(e) => handleTempReviewChange(product._id, e.target.value)}
                        rows="3"
                      />

                      <select
                        className="form-select mb-2"
                        value={ratings[product._id] || 0}
                        onChange={(e) => handleRatingChange(product._id, Number(e.target.value))}
                      >
                        <option value={0}>Rate this product</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                      </select>

                      <div className="d-grid gap-2">
                        <button onClick={() => handleSubmitReview(product._id)} className="btn btn-primary">
                          Submit Review
                        </button>
                        <button onClick={() => handleSubmitRating(product._id)} className="btn btn-outline-primary">
                          Submit Rating
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
            <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100vh',  // Full viewport height
                  width: '100vw',   // Full viewport width
                }}
            >No purchased products available</Box>
        )}
      </main>
      <div className={styles.footerWrapper}>
        <Footer />
      </div>
    </div>
  );
};

export default PurchasedProducts;