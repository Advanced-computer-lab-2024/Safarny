import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '/src/client/Components/Footer/Footer';
import Header from '/src/client/Components/Header/Header';
// import ProfileHeader from '/src/client/Components/ProfileHeader/ProfileHeader';
import styles from './ProductList.module.css';
import {CircularProgress, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import StarRatings from 'react-star-ratings';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import Box from "@mui/material/Box";

const ProductList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId: initialUserId } = location.state || {};

  const [userId, setUserId] = useState(initialUserId || localStorage.getItem('userId'));
  const [sellers, setSellers] = useState({});
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
  const [userRole, setUserRole] = useState('');
  const [wishlist, setWishlist] = useState({});



  const fetchExchangeRates = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_EXCHANGE_API_URL);
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
    if (!userId) {
      console.error('User ID is undefined');
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get('/admin/products');

        if (Array.isArray(response.data)) {
          setProducts(response.data);

          const sellerIds = response.data.map(product => product.createdby);
          const uniqueSellerIds = [...new Set(sellerIds)];

          const sellerPromises = uniqueSellerIds.map(id => {
            if (!id) {
              console.error('Seller ID is undefined');
              return null;
            }
            return axios.get(`/tourist/${id}`).then(res => res.data);
          });

          const sellerData = await Promise.all(sellerPromises.filter(Boolean));

          const sellersMap = sellerData.reduce((acc, seller) => {
            acc[seller._id] = seller.username; // Assuming the seller's name is in the `username` field
            return acc;
          }, {});

          setSellers(sellersMap);
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
        setWalletCurrency(user.walletcurrency || 'EGP');
        setSelectedCurrency(user.walletcurrency || 'EGP');
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
      const response = await axios.post('/wishlist/add', { userId, postId });
      setWishlist(prevWishlist => ({
        ...prevWishlist,
        [postId]: true,
      }));
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
      console.log("userid: ", userId);
      const updatedProduct = { ...product, quantity: product.quantity - 1, purchasedCount: product.purchasedCount + 1 };
      await axios.put(`/admin/products/${product._id}`, updatedProduct);
      await axios.put(`/admin/products/${product._id}`, updatedProduct);
      const profileResponse = await axios.get(`/tourist/${userId}`);
      const currentPosts = profileResponse.data.posts || [];
      const updatedPosts = [...currentPosts, product._id];

      await axios.put(`/tourist/${userId}`, {
        id: userId,
        posts: updatedPosts,
        wallet: wallet - convertedPrice,
      });

      setProducts(products.map(p => p._id === product._id ? updatedProduct : p));
      setWallet(wallet - convertedPrice);
    } catch (err) {
      console.error('Error updating product status:', err);
    }
  };

  const handleAddToCartClick = async (product) => {
    try {
      console.log("userid: ", userId);
  
      // Fetch the current user data to get the existing cart
      const profileResponse = await axios.get(`/tourist/${userId}`);
      const currentCart = profileResponse.data.cart || [];
  
      // Add the product ID to the cart array
      const updatedCart = [...currentCart, product._id];
  
      // Update the user profile with the new cart
      await axios.put(`/tourist/${userId}`, {
        id: userId,
        cart: updatedCart,
      });
  
      console.log(`Product ${product._id} added to cart.`);
      // Display success message
      alert(`Successfully added to cart .`);
    } catch (err) {
      console.error('Error adding product to cart:', err);
    }
  };
  
  const handleClick = () => {
    console.log(userId);
    navigate("/PurchasedProducts", { state: { userId } });
  };
  const handleViewMyCartClick = () => {
    console.log(userId);
    navigate("/MyCart", { state: { userId } });
  };
  

  const filteredProducts = products.filter(product => {
    const convertedPrice = convertPrice(product.price, product.currency, selectedCurrency);

    if (userRole === 'Tourist') {
      return product.details.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (priceFilter ? parseFloat(convertedPrice) <= parseFloat(priceFilter) : true) &&
          product.quantity > 0 &&
          !product.archived;
    }

    return product.details.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (priceFilter ? parseFloat(convertedPrice) <= parseFloat(priceFilter) : true) &&
        product.quantity > 0;
  });

  const sortedProducts = sortByRating
      ? [...filteredProducts].sort((a, b) => b.averageRating - a.averageRating)
      : filteredProducts;

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
    return <p>{error}</p>;
  }

  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      <div className="container py-4">
        <div className={styles.pageHeader}>
          <h1>Product Catalog</h1>
          <div className={styles.actionButtons}>
            <button 
              className={styles.viewButton}
              onClick={handleClick}
            >
              <i className="fas fa-shopping-bag me-2"></i>
              Purchased Products
            </button>
            <button 
              className={styles.viewButton}
              onClick={handleViewMyCartClick}
            >
              <i className="fas fa-shopping-cart me-2"></i>
              My Cart
            </button>
          </div>
        </div>

        <div className={styles.controlPanel}>
          <div className="row g-4">
            <div className="col-md-6">
              <div className={styles.searchBox}>
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className={styles.filterGroup}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      type="number"
                      placeholder="Max price"
                      value={priceFilter}
                      onChange={(e) => setPriceFilter(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6">
                    <select
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value)}
                      className="form-select"
                    >
                      {currencyCodes.map(code => (
                        <option key={code} value={code}>{code}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className={styles.sortGroup}>
                <label className={styles.toggleLabel}>
                  <span>Sort by Rating</span>
                  <label className={styles.toggleSwitch}>
                    <input
                      type="checkbox"
                      checked={sortByRating}
                      onChange={() => setSortByRating(!sortByRating)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.productsGrid}>
          {sortedProducts.map(product => {
            const convertedPrice = convertPrice(product.price, product.currency, selectedCurrency);
            const sellerName = sellers[product.createdby] || "Unknown Seller";
            const averageRating = product.rating.length > 0 ? 
              (product.rating.reduce((acc, val) => acc + val, 0) / product.rating.length).toFixed(1) : 0;

            return (
              <div key={product._id} className={styles.productCard}>
                <div className={styles.productImage}>
                  <img src={product.imageurl} alt={product.details} />
                  <button 
                    className={styles.wishlistButton}
                    onClick={() => handleAddToWishlist(product._id)}
                  >
                    {wishlist[product._id] ? 
                      <Bookmark className={styles.bookmarkIcon} /> : 
                      <BookmarkBorder className={styles.bookmarkIcon} />
                    }
                  </button>
                </div>
                
                <div className={styles.productContent}>
                  <h3>{product.details}</h3>
                  
                  <div className={styles.productMeta}>
                    <div className={styles.price}>
                      {convertedPrice} {selectedCurrency}
                    </div>
                    <div className={styles.quantity}>
                      Stock: {product.quantity}
                    </div>
                  </div>

                  <div className={styles.sellerInfo}>
                    <span>Seller: {sellerName}</span>
                  </div>

                  <div className={styles.rating}>
                    <StarRatings
                      rating={Math.round(averageRating * 2) / 2}
                      starRatedColor="gold"
                      numberOfStars={5}
                      starDimension="20px"
                      starSpacing="2px"
                      name="rating"
                    />
                    <span>({averageRating})</span>
                  </div>

                  {product.reviews && product.reviews.length > 0 && (
                    <div className={styles.reviews}>
                      <h4>Reviews ({product.reviews.length})</h4>
                      <div className={styles.reviewsList}>
                        {product.reviews.map((review, index) => (
                          <div key={index} className={styles.review}>
                            {review}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    className={styles.addToCartButton}
                    onClick={() => handleAddToCartClick(product)}
                  >
                    <i className="fas fa-cart-plus me-2"></i>
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductList;

