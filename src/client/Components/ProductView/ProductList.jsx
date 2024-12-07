import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '/src/client/components/Footer/Footer';
import Header from '/src/client/components/Header/Header';
import ProfileHeader from '/src/client/components/ProfileHeader/ProfileHeader';
import styles from './ProductList.module.css';
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import StarRatings from 'react-star-ratings';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';

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

          const sellerPromises = uniqueSellerIds.map(id =>
              axios.get(`/user/${id}`).then(res => res.data)
          );

          const sellerData = await Promise.all(sellerPromises);

          const sellersMap = sellerData.reduce((acc, seller) => {
            acc[seller._id] = seller.sellerName;
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
      const profileResponse = await axios.get(`http://localhost:3000/tourist/${userId}`);
      const currentPosts = profileResponse.data.posts || [];
      const updatedPosts = [...currentPosts, product._id];

      await axios.put(`http://localhost:3000/tourist/${userId}`, {
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
      const profileResponse = await axios.get(`http://localhost:3000/tourist/${userId}`);
      const currentCart = profileResponse.data.cart || [];
  
      // Add the product ID to the cart array
      const updatedCart = [...currentCart, product._id];
  
      // Update the user profile with the new cart
      await axios.put(`http://localhost:3000/tourist/${userId}`, {
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
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles.container}>
      <Header />
      
      {/* Filter Section */}
      <div className={styles.filterSection}>
        <div className="container">
          <div className="row g-3">
            <div className="col-md-6">
              <div className={styles.searchGroup}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                <i className="fas fa-search"></i>
              </div>
            </div>

            <div className="col-md-6">
              <div className={styles.filterControls}>
                <div className={styles.filterItem}>
                  <input
                    type="number"
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className={styles.priceInput}
                    placeholder="Max price"
                  />
                </div>

                <div className={styles.filterItem}>
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className={styles.currencySelect}
                  >
                    {currencyCodes.map(code => (
                      <option key={code} value={code}>{code}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.filterItem}>
                  <label className={styles.ratingLabel}>
                    <input
                      type="checkbox"
                      checked={sortByRating}
                      onChange={() => setSortByRating(!sortByRating)}
                      className={styles.ratingCheckbox}
                    />
                    <span>Sort by Rating</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button 
              className={styles.viewButton}
              onClick={handleClick}
            >
              View Purchased Products
            </button>
            <button 
              className={styles.viewButton}
              onClick={handleViewMyCartClick}
            >
              View My Cart
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container-fluid px-4 py-4">
        <h1 className="text-center mb-4">Product List</h1>
        
        {sortedProducts.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
            {sortedProducts.map(product => {
              const convertedPrice = convertPrice(product.price, product.currency, selectedCurrency);
              const sellerName = sellers[product.createdby] || "Unknown Seller";
              const averageRating = product.rating.length > 0 ? 
                (product.rating.reduce((acc, val) => acc + val, 0) / product.rating.length).toFixed(1) : 0;
              const isWishlisted = wishlist[product._id] || false;

              return (
                <div className="col" key={product._id}>
                  <div className="card h-100 shadow-sm hover-shadow border-0">
                    <div className="position-relative">
                      <img 
                        src={product.imageurl} 
                        className="card-img-top"
                        alt={product.details}
                        style={{ height: '250px', objectFit: 'cover' }}
                      />
                      <button 
                        className="btn position-absolute top-0 end-0 m-2 bg-white shadow-sm"
                        onClick={() => handleAddToWishlist(product._id)}
                      >
                        {isWishlisted ? 
                          <Bookmark className="text-primary" /> : 
                          <BookmarkBorder className="text-primary" />
                        }
                      </button>
                      <div className="position-absolute bottom-0 start-0 m-2">
                        <span className="badge bg-primary fs-6 px-3 py-2 shadow-sm">
                          {convertedPrice} {selectedCurrency}
                        </span>
                      </div>
                    </div>

                    <div className="card-body d-flex flex-column p-4">
                      <h5 className="card-title text-dark mb-3">{product.details}</h5>
                      
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-muted">Available: {product.quantity}</span>
                        <span className="text-muted">Seller: {sellerName}</span>
                      </div>
                      
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <StarRatings
                          rating={Math.round(averageRating * 2) / 2}
                          starRatedColor="gold"
                          numberOfStars={5}
                          starDimension="20px"
                          starSpacing="2px"
                          name="rating"
                        />
                        <span className="text-muted">({averageRating})</span>
                      </div>

                      {userRole === 'Seller' && (
                        <div className="mb-3 p-3 bg-light rounded">
                          <p className="card-text mb-1">
                            <small>Purchased: {product.purchasedCount} units</small>
                          </p>
                          <p className="card-text mb-0">
                            <small>
                              Sales: {product.purchasedCount * product.price} {product.currency}
                            </small>
                          </p>
                        </div>
                      )}

                      {/* Reviews Section */}
                      {product.reviews && product.reviews.length > 0 && (
                        <div className="mb-3">
                          <h6 className="mb-2">Reviews ({product.reviews.length})</h6>
                          <div className="bg-light rounded p-3" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                            {product.reviews.map((review, index) => (
                              <div key={index} className="mb-2 pb-2 border-bottom">
                                <small className="text-dark">{review}</small>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <button
                        className="btn btn-primary w-100 mt-auto shadow-sm"
                        onClick={() => handleAddToCartClick(product)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="alert alert-info">No products available</div>
        )}
      </div>
      <Footer className="w-100 mt-auto" />
    </div>
  );
};

export default ProductList;

