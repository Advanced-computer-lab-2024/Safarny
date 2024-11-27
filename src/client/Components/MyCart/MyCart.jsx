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
  const [products, setProducts] = useState([]);
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
        console.log("User role:", user.role);
        console.log("Wallet fetched:", user.wallet);
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
                  return null; // Return null if product is not found
                } else {
                  throw err; // Re-throw other errors
                }
              }
            })
          );

          const validCartItems = productDetails.filter((item) => item !== null);
          setCartItems(validCartItems);
          // Initialize desiredQuantities
          const initialQuantities = productDetails.reduce((acc, item) => {
            acc[item._id] = 1; // Default quantity is 1
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

  const convertPrice = (price, fromCurrency, toCurrency) => {
    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
      console.error("Exchange rates not available for the given currencies");
      return price;
    }
    const rateFrom = exchangeRates[fromCurrency];
    const rateTo = exchangeRates[toCurrency];
    return ((price / rateFrom) * rateTo).toFixed(2);
  };

  const handleBuyButtonClick = async (product, desiredQuantity) => {
    const convertedPrice = convertPrice(
      product.price,
      product.currency,
      walletCurrency
    );
    const totalPrice = convertedPrice * desiredQuantity;

    console.log("Wallet:", wallet);
    console.log("Converted Price (each):", convertedPrice);
    console.log("Total Price:", totalPrice);

    if (wallet < totalPrice) {
      alert(
        "You do not have enough funds to purchase this quantity of the product."
      );
      return;
    }

    if (product.quantity < desiredQuantity) {
      alert("Not enough stock available for the desired quantity.");
      return;
    }

    try {
      console.log("User ID:", userId);

      // Update the product
      const updatedProduct = {
        ...product,
        quantity: product.quantity - desiredQuantity,
        purchasedCount: product.purchasedCount + desiredQuantity,
      };

      await axios.put(`/admin/products/${product._id}`, updatedProduct);

      // Fetch the current user profile
      const profileResponse = await axios.get(
        `http://localhost:3000/tourist/${userId}`
      );
      const currentPosts = profileResponse.data.posts || [];
      const updatedPosts = [
        ...currentPosts,
        ...Array(desiredQuantity).fill(product._id),
      ];

      // Update the user's profile with the new wallet and posts
      await axios.put(`http://localhost:3000/tourist/${userId}`, {
        id: userId,
        posts: updatedPosts,
        wallet: wallet - totalPrice,
      });

      // Update local state
      setProducts(
        products.map((p) => (p._id === product._id ? updatedProduct : p))
      );
      setWallet(wallet - totalPrice);

      // Display success message
      alert(`Successfully purchased ${desiredQuantity} ${product.details}(s)!`);

      // Remove the item from the cart
      await handleRemoveFromCart(product); // Call the function to remove from the cart

      // Send notification to the seller if the product is out of stock
      if (updatedProduct.quantity === 0) {
        const sellerResponse = await axios.get(`/tourist/${product.createdby}`);
        const sellerId = sellerResponse.data._id;
        const sellerEmail = sellerResponse.data.email;

        const title = `Product "${product.details}" is out of stock`;
        const message = `Your product "${product.details}" is now out of stock.`;

        await axios.post("/notification/create", {
          title,
          message,
          userId: product.createdby,
        });

        await axios.post("/email/send-email", {
          to: sellerEmail,
          subject: title,
          body: message,
        });

        console.log("Notification and email sent to the seller");
      }
    } catch (err) {
      console.error("Error updating product status:", err);
      alert(
        "An error occurred while purchasing the product. Please try again."
      );
    }
  };

  const handleQuantityChange = (productId, change) => {
    setDesiredQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max(1, (prevQuantities[productId] || 1) + change),
    }));
  };

  const handleRemoveFromCart = async (product) => {
    try {
      console.log("User ID: ", userId);
      // Fetch the user's current cart
      const profileResponse = await axios.get(
        `http://localhost:3000/tourist/${userId}`
      );
      const currentCart = profileResponse.data.cart || [];

      // Remove the product ID from the cart
      const updatedCart = currentCart.filter((id) => id !== product._id);

      // Update the user's profile with the updated cart
      await axios.put(`http://localhost:3000/tourist/${userId}`, {
        id: userId,
        cart: updatedCart,
      });

      // Update the state locally to reflect the removal
      setCartItems(cartItems.filter((item) => item._id !== product._id));
    } catch (err) {
      console.error("Error removing product from cart:", err);
    }
  };

  if (loading) {
    return <p>Loading cart items...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const totalPrice2 = cartItems.reduce(
    (sum, item) =>
      sum + parseFloat(convertPrice(item.price, item.currency, walletCurrency)),
    0
  );

  return (
    <div className={styles.container}>
      <Header />
      <h1 className={styles.headerTitle}>My Cart</h1>
      <button
        className={styles.proceedButton}
        onClick={() => setShowCheckoutModal(true)}
      >
        Proceed to checkout
      </button>

      {showCheckoutModal && (
        <CheckoutModal
          cartItems={cartItems}
          totalPrice={totalPrice2}
          onClose={() => setShowCheckoutModal(false)}
          currency={walletCurrency}
          userId={userId}
          desiredQuantities={desiredQuantities}
        />
      )}

      {cartItems.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {cartItems.map((item) => {
            const convertedPrice = convertPrice(
              item.price,
              item.currency,
              walletCurrency
            );
            const desiredQuantity = desiredQuantities[item._id] || 1; // Default to 1 if not set

            const averageRating =
              item.rating.length > 0
                ? (
                    item.rating.reduce((acc, val) => acc + val, 0) /
                    item.rating.length
                  ).toFixed(1)
                : 0;
            return (
              <div className={styles.productCard} key={item._id}>
                <h2 className={styles.productDetails}>{item.details}</h2>
                <p>
                  Price: {convertedPrice} {walletCurrency}
                </p>
                <p>Quantity: {item.quantity}</p>
                <div>
                  <button
                    onClick={() => handleQuantityChange(item._id, -1)}
                    disabled={desiredQuantity <= 1}
                  >
                    -
                  </button>
                  <span>{desiredQuantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, 1)}
                    disabled={desiredQuantity >= item.quantity}
                  >
                    +
                  </button>
                </div>
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

                <img
                  className={styles.productImage}
                  src={item.imageurl}
                  alt={item.details}
                />
                <button
                  className={styles.buyButton}
                  onClick={() =>
                    handleBuyButtonClick(item, desiredQuantities[item._id] || 1)
                  }
                >
                  Purchase
                </button>
                <button
                  className={styles.button}
                  onClick={() => handleRemoveFromCart(item)}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No items in the cart available</p>
      )}
      <Footer />
    </div>
  );
};

export default Cart;
