import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Logo from '/src/client/Assets/Img/logo.png';
import Footer from '/src/client/components/Footer/Footer';
import styles from './PurchasedProducts.module.css';



const PurchasedProducts = () => {
  const [searchParams] = useSearchParams();
  const touristId = localStorage.getItem('userId');
 // const touristId = searchParams.get('userId'); // Retrieve touristId from URL  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState({}); 
  const [ratings, setRatings] = useState({});

  useEffect(() => {

    const fetchPurchasedProducts = async () => {
      try {
        const response = await axios.get(`/tourist/${touristId}`);
        console.log("Fetched tourist data:", response.data);
        const postIds = response.data?.posts || []; // Retrieve post IDs
        console.log("Fetched product data:", postIds); // Add this line for debugging

        if (postIds.length > 0) {
            console.log("Fetched length", postIds.length );
          // Fetch details for each post ID
          const productDetails = await Promise.all(
            postIds.map(async (postId) => {
              const productResponse = await axios.get(`/admin/products/${postId}`);
              console.log("Fetched info", productResponse.data);
              //setProducts(productResponse.data);
              return productResponse.data; // Return product details
              
            })
          );
          setProducts(productDetails); // Set all fetched product details
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
    setReviews(prevReviews => ({
      ...prevReviews,
      [productId]: value,
    }));
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
      <header className={styles.header}>
        <img src={Logo} alt="Safarny Logo" className={styles.logo} />
        <h1>Safarny</h1>
        <nav className={styles.nav}>
          <Link to="/" className={styles.button}>Back to Home</Link>
          <Link to="/products" className={styles.button}>All Products</Link>
        </nav>
      </header>
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
