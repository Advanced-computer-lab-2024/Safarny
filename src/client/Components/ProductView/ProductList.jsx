import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import Logo from '/src/client/Assets/Img/logo.png';
import Footer from '/src/client/components/Footer/Footer';
import Header from '/src/client/components/Header/Header';
import styles from './ProductList.module.css';
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

const ProductList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('EGP'); // Define selectedCurrency state
  const [sortByRating, setSortByRating] = useState(false);
   
   const touristId = localStorage.getItem('userId');// Change this to how you store the ID
   console.log("Id", touristId);
   const [userRole, setUserRole] = useState('');

   const conversionRates = {
     USD: 1 / 48.72,
     SAR: 1 / 12.97,
     GBP: 1 / 63.02,
     EUR: 1 / 53.02,
     EGP: 1, // EGP to EGP is 1:1
   };
 
   const convertPrice = (price, fromCurrency, toCurrency) => {
     const rateFrom = conversionRates[fromCurrency];
     const rateTo = conversionRates[toCurrency];
     return ((price / rateFrom) * rateTo).toFixed(2); // Convert and format to 2 decimal places
   };

  useEffect(() => {
    if (!touristId) {
      console.error('User ID is undefined');
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get('/admin/products');

        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error("Expected an array, but got:", typeof response.data);
          setError('Invalid data format received');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    const fetchUserRole = async () => {
  try {
    const response = await axios.get(`/tourist/${userId}`);
    const user = response.data;
    setUserRole(user.role);
    console.log('User role:', user.role);
  } catch (err) {
    console.error('Error fetching user role:', err);
  }
};

    fetchProducts(); 
    fetchUserRole(); 
  }, [userId]);
  const handleAddToWishlist = async (postId) => {
    try {
      console.log('Adding post to wishlist:', postId); // Log the postId
      const response = await axios.post('/wishlist/add', { userId, postId });
      //setWishList(response.data.items); // Update the state with the response data
      alert('Post added to wishlist');
    } catch (err) {
      console.error('Error adding post to wishlist:', err);
      alert('Failed to add post to wishlist');
    }
  };

  const handleNavigate = (path) => {
    navigate(path, { state: { userId } });
  };
  const handleBuyButtonClick = async (product) => {
    try {
      // Decrement the product quantity on the server
      const updatedProduct = { ...product, quantity: product.quantity - 1 };
      await axios.put(`/admin/products/${product._id}`, updatedProduct);

      // Fetch the current user's profile to get the existing posts
      const profileResponse = await axios.get(`http://localhost:3000/tourist/${touristId}`);
      const currentPosts = profileResponse.data.posts || []; // Get current posts or initialize as an empty array

      // Create a new array with the new product added at the end
      const updatedPosts = [...currentPosts, product._id]; // Append the new product ID to the current posts array

      // Now update the user profile with the updated posts array
      await axios.put(`http://localhost:3000/tourist/${touristId}`, {
        id: touristId,
        posts: updatedPosts // Send the updated posts array to the server
      });

      // Update the local state to reflect the new quantity
      setProducts(products.map(p => p._id === product._id ? updatedProduct : p));
    } catch (err) {
      console.error('Error updating product status:', err);
    }
  };


  // Handle filtering products based on search term
  const filteredProducts = products.filter(product => {
    const convertedPrice = convertPrice(product.price, product.currency, selectedCurrency);
    return product.details.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (priceFilter ? parseFloat(convertedPrice) <= parseFloat(priceFilter) : true) &&
        product.quantity > 0; // Exclude products with quantity 0
  });

  const sortedProducts = sortByRating
    ? [...filteredProducts].sort((a, b) => b.rating - a.rating)
    : filteredProducts;

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  
  return (
    <div className={styles.container}>
        <Header/>
        
       {/* View Purchased Products Button */}
       <button 
        className={styles.viewPurchasedButton} 
        onClick={() => navigate(`/PurchasedProducts?userId=${touristId}`)}
      >
        View Purchased Products
      </button>
      <h1>Product List</h1>
      
      {/* Search Input */}
      <input 
        type="text" 
        placeholder="Search by name..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        className={styles.searchInput}
      />

        <div className={styles.priceFilter}>
          <label>Max Price:</label>
          <input
              type="number"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className={styles.priceInput}
          />
        </div>
        <div className={styles.currencySelector}>
          <FormControl fullWidth margin="normal">
            <InputLabel><h4>Currency</h4></InputLabel>
            <br></br>
            <Select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
            >
              <MenuItem value="EGP">EGP</MenuItem>
              <MenuItem value="SAR">SAR</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
              <MenuItem value="GBP">GBP</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className={styles.sortOptions}>
          <label>
            Sort by Ratings
            <input
                type="checkbox"
                checked={sortByRating}
                onChange={() => setSortByRating(!sortByRating)}
            />
          </label>
        </div>

        {sortedProducts.length > 0 ? (
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
              {sortedProducts.map(product => {
                const convertedPrice = convertPrice(product.price, product.currency, selectedCurrency);
                return (
                    <div className={styles.productCard} key={product._id}>
                      <h2 className={styles.productDetails}>{product.details}</h2>
                      <p>Price: {convertedPrice} {selectedCurrency}</p>
                      <p>Quantity: {product.quantity}</p>
                      <p>Rating: {product.rating}</p>
                       {/* Buy Button */}
               <button 
                className={styles.buyButton} 
                onClick={() => handleBuyButtonClick(product)}
              >
                Purchase
              </button>
                      {userRole === 'Tourist' && (
                          <button
                              onClick={() => handleAddToWishlist(product._id)}
                              className={styles.wishlistButton}
                          >
                            Add to Wishlist
                          </button>
                      )}
                      <img className={styles.productImage} src={product.imageurl} alt={product.details}/>
                    </div>
                );
              })}
            </div>
        ) : (
            <p>No products available</p>
        )}
        <Footer/>
      </div>
  );
};

export default ProductList;