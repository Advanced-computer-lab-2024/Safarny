import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ProductList.module.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [sortByRating, setSortByRating] = useState(false);

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

  return (
    <div className={styles.container}>
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
              <img className={styles.productImage} src={product.imageurl} alt={product.details} />
            </div>
          ))}
        </div>
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
};

export default ProductList;
