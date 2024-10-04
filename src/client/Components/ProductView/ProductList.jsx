import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ProductList.module.css'; // Optional for styling

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/posting/posts');
        
        console.log("API Response Data:", response.data);  // Log the API response
        
        // Check if response data is an array
        if (Array.isArray(response.data)) {
          setProducts(response.data);  // Set products if data is an array
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

    fetchProducts();  // Fetch data on component mount
  }, []);

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Product List</h1>
      {products.length > 0 ? (
        <ul>
          {products.map(product => (
            <li key={product._id}>
              <h2>{product.details}</h2>
              <p>Price: {product.price}</p>
              <p>Quantity: {product.quantity}</p>
              <img src={product.imageurl} alt={product.details} width="100" />
            </li>
          ))}
        </ul>
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
};

export default ProductList;
