import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
// import Logo from '/src/client/Assets/Img/logo.png';
import Footer from '/src/client/components/Footer/Footer';
import Header from '/src/client/components/Header/Header';
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
  const [tempReviews, setTempReviews] = useState({}); // Temporarily holds input text


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
    setReviews(prevReviews => {
      const currentReviews = prevReviews[productId] || []; // Get existing reviews for the product or initialize an empty array
  
      // Find the first empty spot in the array, if any
      const emptyIndex = currentReviews.findIndex(review => !review);
  
      // Create a new array for updated reviews
      const updatedReviews = [...currentReviews];
  
      if (emptyIndex !== -1) {
        // Place the review in the first empty spot
        updatedReviews[emptyIndex] = value;
      } else {
        // If no empty spot, add the new review at the end
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

  // Update tempReviews with the current text
const handleTempReviewChange = (productId, value) => {
  setTempReviews(prevTempReviews => ({
    ...prevTempReviews,
    [productId]: value,
  }));
};

  // On submit, add the review to the array
const handleSubmitReview = (productId) => {
const newReview = tempReviews[productId] || "";
console.log("new is",newReview);

if (newReview.trim() !== "") {
  setReviews(prevReviews => {
    // Get the existing reviews array for the specified productId
    const currentReviews = prevReviews[productId] || [];
    console.log("new is",currentReviews);

    // Find the first empty spot (an empty string) in the reviews array
    const firstEmptyIndex = currentReviews.findIndex(review => review === "");

    let updatedReviews;
    if (firstEmptyIndex !== -1) {
      // Insert the new review at the first empty spot
      updatedReviews = [...currentReviews];
      updatedReviews[firstEmptyIndex] = newReview;
    } else {
      // If no empty spot, append the new review to the end of the array
      updatedReviews = [...currentReviews, newReview];
    }

    // Update the reviews array for the specific product
    return {
      ...prevReviews,
      [productId]: updatedReviews
    };
  });

  // Clear tempReviews entry for the product after submission
  setTempReviews(prevTempReviews => ({
    ...prevTempReviews,
    [productId]: "" // Reset the input field for this product
  }));
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
  value={tempReviews[product._id] || ''} // Use tempReviews here
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
