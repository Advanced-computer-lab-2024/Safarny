import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Footer from "/src/client/components/Footer/Footer";
import Header from "/src/client/components/Header/Header";
import styles from "./MyCart.module.css";
import StarRatings from "react-star-ratings";
import CheckoutModal from "../MyOrder/CheckoutModal.jsx";

const Cart = () => {
  const location = useLocation();
  const { userId } = location.state || {};
  const touristId = userId || localStorage.getItem("userId");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletCurrency, setWalletCurrency] = useState("USD"); // Default to USD
  const [exchangeRates, setExchangeRates] = useState({});
  const [wallet, setWallet] = useState(0);
  const [userRole, setUserRole] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(walletCurrency);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const [desiredQuantities, setDesiredQuantities] = useState({});

  useEffect(() => {
    const fetchUserWalletCurrency = async () => {
      try {
        const response = await axios.get(`/user/${touristId}/wallet`);
        setWalletCurrency(response.data.currency);
      } catch (err) {
        console.error("Error fetching wallet currency:", err);
      }
    };
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(`/tourist/${userId}`);
        const user = response.data;
        setUserRole(user.role);
        setWallet(user.wallet);
        setWalletCurrency(user.walletcurrency || "EGP");
        setSelectedCurrency(user.walletcurrency || "EGP"); // Set selectedCurrency to walletCurrency
      } catch (err) {
        console.error("Error fetching user role:", err);
      }
    };
    fetchUserRole();

    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        setExchangeRates(response.data.rates);
      } catch (err) {
        console.error("Error fetching exchange rates:", err);
      }
    };

    fetchUserWalletCurrency();
    fetchExchangeRates();
  }, [touristId]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`/tourist/${touristId}`);
        const cartIds = response.data?.cart || [];

        if (cartIds.length > 0) {
          const productDetails = await Promise.all(
            cartIds.map(async (cartId) => {
              try {
                const productResponse = await axios.get(
                  `/admin/products/${cartId}`
                );
                return productResponse.data;
              } catch (err) {
                if (err.response && err.response.status === 404) {
                  console.warn(`Product with ID ${cartId} not found.`);
                  return null;
                } else {
                  throw err;
                }
              }
            })
          );

          const validCartItems = productDetails.filter((item) => item !== null);
          setCartItems(validCartItems);
          const initialQuantities = productDetails.reduce((acc, item) => {
            acc[item._id] = 1;
            return acc;
          }, {});
          setDesiredQuantities(initialQuantities);

          if (validCartItems.length === 0) {
            setError("No items in the cart for this user.");
          }
        } else {
          setError("No items in the cart for this user.");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cart items:", err);
        setError("Failed to fetch cart items");
        setLoading(false);
      }
    };

    if (touristId) {
      fetchCartItems();
    }
  }, [touristId]);

  if (loading) {
    return (
      <>
        <Header />
        <p>Loading cart items...</p>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <p>{error}</p>
        <Footer />
      </>
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      <h1 className={styles.headerTitle}>My Cart</h1>
      {cartItems.length > 0 ? (
        <div>
          {/* Cart items rendering logic */}
        </div>
      ) : (
        <p>No items in the cart available</p>
      )}
      <Footer />
    </div>
  );
};

export default Cart;
