import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '/src/client/Assets/Img/logo.png';
import Footer from '/src/client/components/Footer/Footer';
import styles from './ProductList.module.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [sortByRating, setSortByRating] = useState(false);
  //const [showPurchasedOnly, setShowPurchasedOnly] = useState(false); // New state for showing only purchased products
  const navigate = useNavigate();
  // Assuming you have the tourist ID stored in localStorage or context
  const touristId = localStorage.getItem('userId');// Change this to how you store the ID
  console.log("Id", touristId);


  useEffect(() => {
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

    fetchProducts();  
  }, []);

  const handleBuyButtonClick = async (product) => {
    try {
        // Fetch the current user's profile to get the existing posts
        const profileResponse = await axios.get(`http://localhost:3000/tourist/${touristId}`);
        const currentPosts = profileResponse.data.posts || []; // Get current posts or initialize as an empty array

        // Create a new array with the new product added at the end
        const updatedPosts = [...currentPosts, product._id]; // Append the new product ID to the current posts array

        // Now update the user profile with the updated posts array
        const updateResponse = await axios.put(`http://localhost:3000/tourist/${touristId}`, {
            id: touristId,
            posts: updatedPosts // Send the updated posts array to the server
        });

        console.log(`Response from server:`, updateResponse.data);

    } catch (err) {
        console.error('Error updating product status:', err);
    }
};

  // Handle filtering products based on search term
  const filteredProducts = products.filter(product => 
    product.details.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (priceFilter ? product.price <= priceFilter : true) 

  );


  // Handle sorting products by ratings if needed
  const sortedProducts = sortByRating
    ? [...filteredProducts].sort((a, b) => b.rating - a.rating) // Assuming 'rating' is a field in your product data
    : filteredProducts;

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  const handleViewPurchasedProducts = () => {
    navigate("/PurchasedProducts", { state: { userId } });
  };
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src={Logo} alt="Safarny Logo" className={styles.logo} />
        <h1>Safarny</h1>
        <nav className={styles.nav}>
          <Link to="/" className={styles.button}>Back to Home</Link>
        </nav>
      </header>
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

      {/* Price Filter */}
      <div className={styles.priceFilter}>
        <label>Max Price:</label>
        <input 
          type="number" 
          value={priceFilter} 
          onChange={(e) => setPriceFilter(e.target.value)} 
          className={styles.priceInput}
        />
      </div>

      {/* Sort by Ratings */}
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
               {/* Buy Button */}
               <button 
                className={styles.buyButton} 
                onClick={() => handleBuyButtonClick(product)}
              >
                Purchase
              </button>

              <img className={styles.productImage} src={product.imageurl} alt={product.details} />
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