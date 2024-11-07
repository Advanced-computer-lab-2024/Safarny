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

  useEffect(() => {
    const fetchPurchasedProducts = async () => {
      try {
        console.log("Fetching purchased products for user ID:", userId);
        console.log("Fetching purchased products for tourist ID:", touristId);
        const response = await axios.get(`/tourist/${touristId}`);
        console.log("Fetched tourist data:", response.data);
        const postIds = response.data?.posts || [];
        console.log("Fetched product data:", postIds);

        if (postIds.length > 0) {
          const productDetails = await Promise.all(
            postIds.map(async (postId) => {
              const productResponse = await axios.get(`/admin/products/${postId}`);
              console.log("Fetched info", productResponse.data);
              return productResponse.data;
            })
          );
          setProducts(productDetails);
          console.log("Fetched info2", productDetails);
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
    const review = reviews[productId] || "no reviews";
    try {
      await axios.put(`/admin/products/${productId}`, { review });
      alert("Review submitted successfully!");
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review. Please try again.');
    }
  };

  const handleSubmitRating = async (productId) => {
    const rating = ratings[productId] || 0;
    try {
      await axios.put(`/admin/products/${productId}`, { rating });
      alert("Rating submitted successfully!");
    } catch (err) {
      console.error('Error submitting rating:', err);
      alert('Failed to submit rating. Please try again.');
    }
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
          {products.map(product => (
            <div className={styles.productCard} key={product._id}>
              <h2 className={styles.productDetails}>{product.details}</h2>
              <p>Price: ${product.price}</p>
              <p>Quantity: {product.quantity}</p>
              <p>Rating: {product.rating}</p>
              <p>Reviews: {product.review || "No reviews yet"}</p>
              <img className={styles.productImage} src={product.imageurl} alt={product.details} />

              <textarea
                placeholder="Write your review..."
                value={reviews[product._id] || ''}
                onChange={(e) => handleReviewChange(product._id, e.target.value)}
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
          ))}
        </div>
      ) : (
        <p>No purchased products available</p>
      )}
      <Footer />
    </div>
  );
};

export default PurchasedProducts;