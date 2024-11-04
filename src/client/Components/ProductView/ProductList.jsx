import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '/src/client/Assets/Img/logo.png';
import Footer from '/src/client/components/Footer/Footer';
import styles from './ProductList.module.css';

const ProductList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [sortByRating, setSortByRating] = useState(false);
  const [userRole, setUserRole] = useState('');

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

  const filteredProducts = products.filter(product =>
    product.details.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (priceFilter ? product.price <= priceFilter : true)
  );

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
      <header className={styles.header}>
        <img src={Logo} alt="Safarny Logo" className={styles.logo} />
        <h1>Safarny</h1>
        <nav className={styles.nav}>
          <Link to="/" className={styles.button}>Back to Home</Link>
        </nav>
      </header>
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

      <div className={styles.sortOptions}>
        <label>
          <input
            type="checkbox"
            checked={sortByRating}
            onChange={() => setSortByRating(!sortByRating)}
          />
          Sort by Ratings
        </label>
      </div>

      {sortedProducts.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {sortedProducts.map(product => (
            <div className={styles.productCard} key={product._id}>
              <h2 className={styles.productDetails}>{product.details}</h2>
              <p>Price: ${product.price}</p>
              <p>Quantity: {product.quantity}</p>
              <p>Rating: {product.rating}</p>
              <img className={styles.productImage} src={product.imageurl} alt={product.details} />
              {userRole === 'Tourist' && (
                <button
                  onClick={() => handleAddToWishlist(product._id)}
                  className={styles.wishlistButton}
                >
                  Add to Wishlist
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No products available</p>
      )}
      <Footer />
    </div>
  );
};

export default ProductList;