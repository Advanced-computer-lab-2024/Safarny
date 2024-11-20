import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '/src/client/components/Footer/Footer';
import Header from '/src/client/components/Header/Header';
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
            acc[seller._id] = seller.name;
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

  const handleClick = () => {
    console.log(userId);
    navigate("/PurchasedProducts", { state: { userId } });
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

  <div className={styles.actionsContainer}>
    <div className={styles.filterContainer}>
      <div className={styles.sortOptions}>
        <label className={styles.MaxPrice}>Max Price:</label>
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
          <Select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className={styles.selectInput}
          >
            {currencyCodes.map(code => (
              <MenuItem key={code} value={code}>{code}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className={styles.sortOptions}>
        <label className={styles.sorter}>
          Sort by Ratings:
          <input
            type="checkbox"
            checked={sortByRating}
            onChange={() => setSortByRating(!sortByRating)}
            className={styles.largeCheckbox}
          />
        </label>
      </div>
    </div>
    <input
      type="text"
      placeholder="Search by name..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className={styles.searchInput}
    />
<button
      className={styles.viewPurchasedButton}
      onClick={handleClick}
    >
      View Purchased Products
    </button>
  </div>

  <h1 className={styles.h1}>Product List</h1>

  {sortedProducts.length > 0 ? (
    <div className={styles.productsAll}>
      {sortedProducts.map(product => {
        const convertedPrice = convertPrice(product.price, product.currency, selectedCurrency);
        const sellerName = sellers[product.createdby] || "Unknown Seller";
        const averageRating = product.rating.length > 0 ? (product.rating.reduce((acc, val) => acc + val, 0) / product.rating.length).toFixed(1) : 0;
        const isWishlisted = wishlist[product._id] || false;

        return (
          <div className={styles.productCard} key={product._id}>
            <div className={styles.productImageContainer}>
              <img className={styles.productImage} src={product.imageurl} alt={product.details} />
              <p className={styles.productPrice}>{convertedPrice} {selectedCurrency}</p>
            </div>
            <div className={styles.productDetails}>
              <div className={styles.bookmarkIcon} onClick={() => handleAddToWishlist(product._id)}>
                {isWishlisted ? <Bookmark /> : <BookmarkBorder />}
              </div>
              <h2 className={styles.title}>{product.details}</h2>
              <p className={styles.quantity}>Quantity: {product.quantity}</p>
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
              <p className={styles.seller}>Seller: {sellerName}</p>
              {userRole === 'Seller' && (
                <>
                  <p className={styles.purchasedCount}>Purchased Count: {product.purchasedCount}</p>
                  <p className={styles.sales}>Sales: {product.purchasedCount * product.price}</p>
                </>
              )}
              <div className={styles.reviewsSection}>
                <h3 className={styles.reviewsTitle}>Reviews:</h3>
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
              <div className={styles.buttonContainer}>
                <button
                  className={styles.buyButton}
                  onClick={() => handleBuyButtonClick(product)}
                >
                  Purchase
                </button>
              </div>
            </div>
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

