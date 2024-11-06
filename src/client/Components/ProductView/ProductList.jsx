import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '/src/client/components/Footer/Footer';
import Header from '/src/client/components/Header/Header';
import styles from './ProductList.module.css';
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const ProductList = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const { userId } = location.state || {};

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('EGP');
  const [sortByRating, setSortByRating] = useState(false);
  const [currencyCodes, setCurrencyCodes] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [wallet, setWallet] = useState(0);
  const [walletCurrency, setWalletCurrency] = useState('EGP');

  const touristId = localStorage.getItem('userId');
  const [userRole, setUserRole] = useState('');

  const fetchExchangeRates = async () => {
    try {
      const response = await axios.get('https://v6.exchangerate-api.com/v6/033795aceeb35bc666391ed5/latest/EGP');
      setExchangeRates(response.data.conversion_rates);
      setCurrencyCodes(Object.keys(response.data.conversion_rates));
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    }
  };

  const convertPrice = (price, fromCurrency, toCurrency) => {
    const rateFrom = exchangeRates[fromCurrency];
    const rateTo = exchangeRates[toCurrency];
    return ((price / rateFrom) * rateTo).toFixed(2);
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
        setWallet(user.wallet);
        setWalletCurrency(user.walletcurrency);
        console.log('User role:', user.role);
      } catch (err) {
        console.error('Error fetching user role:', err);
      }
    };

    fetchProducts();
    fetchUserRole();
    fetchExchangeRates();
  }, [userId]);

  const handleAddToWishlist = async (postId) => {
    try {
      console.log('Adding post to wishlist:', postId);
      const response = await axios.post('/wishlist/add', { userId, postId });
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
    const convertedPrice = convertPrice(product.price, product.currency, walletCurrency);
    if (wallet < convertedPrice) {
      alert('You do not have enough funds to purchase this product.');
      return;
    }

    try {
      const updatedProduct = { ...product, quantity: product.quantity - 1 };
      await axios.put(`/admin/products/${product._id}`, updatedProduct);

      const profileResponse = await axios.get(`http://localhost:3000/tourist/${touristId}`);
      const currentPosts = profileResponse.data.posts || [];
      const updatedPosts = [...currentPosts, product._id];

      await axios.put(`http://localhost:3000/tourist/${touristId}`, {
        id: touristId,
        posts: updatedPosts,
        wallet: wallet - convertedPrice // Deduct the price from the wallet
      });

      setProducts(products.map(p => p._id === product._id ? updatedProduct : p));
      setWallet(wallet - convertedPrice); // Update the wallet state
    } catch (err) {
      console.error('Error updating product status:', err);
    }
  };
  const handleArchiveToggle = async (productId, isArchived) => {
    try {
      // Update the local state first
      setProducts(products.map(product => 
        product._id === productId ? { ...product, archived: isArchived } : product
      ));
      console.log("Local state updated");
  
      // Make a request to the server to update the archived status
      await axios.put(`/admin/products/${productId}`, { archived: isArchived });
      console.log("Archived status updated successfully");
  
    } catch (error) {
      console.error("Error updating archived status:", error);
      // Optionally, revert the local state if the API call fails
      setProducts(products.map(product => 
        product._id === productId ? { ...product, archived: !isArchived } : product
      ));
    }
  };

  const filteredProducts = products.filter(product => {
    const convertedPrice = convertPrice(product.price, product.currency, selectedCurrency);
    
    // If the user role is "Tourist", filter out archived products
    if (userRole === 'Tourist') {
      return product.details.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (priceFilter ? parseFloat(convertedPrice) <= parseFloat(priceFilter) : true) &&
        product.quantity > 0 &&
        !product.archived; // Show only products where archived is false
    }
  
    // If the user role is not "Tourist" (i.e., "Seller"), don't filter by archived status
    return product.details.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (priceFilter ? parseFloat(convertedPrice) <= parseFloat(priceFilter) : true) &&
      product.quantity > 0;
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
        <Header />

        <button
            className={styles.viewPurchasedButton}
            onClick={() => navigate(`/PurchasedProducts?userId=${touristId}`)}
        >
          View Purchased Products
        </button>
        <h1>Product List</h1>

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
              {currencyCodes.map(code => (
                  <MenuItem key={code} value={code}>{code}</MenuItem>
              ))}
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
            <div className={styles.productsAll}>
              {sortedProducts.map(product => {
                const convertedPrice = convertPrice(product.price, product.currency, selectedCurrency);
                console.log("Product Reviews:", product.reviews); // Check the structure of reviews
                return (
                    <div className={styles.productCard} key={product._id}>
                      <h2 className={styles.productDetails}>{product.details}</h2>
                      <p>Price: {convertedPrice} {selectedCurrency}</p>
                      <p>Quantity: {product.quantity}</p>
                      <p>Rating: {product.rating}</p>
                      {/* Display Reviews */}
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
                      {userRole === 'Seller' && (
                      <div className={styles.archiveOption}>
                     <label>
                      <input
                       type="checkbox"
                     checked={product.archived}
                  onChange={(e) => handleArchiveToggle(product._id, e.target.checked)}
                    />
                      Archive
                   </label>
                     </div>
                )}

                      <img className={styles.productImage} src={product.imageurl} alt={product.details} />
                    </div>
                );
              })}
            </div>
        ) : (
            <p>No products available</p>
        )}
        <Footer />
      </div>
  );
};

export default ProductList;