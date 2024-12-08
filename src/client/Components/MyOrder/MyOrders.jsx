import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Button,
  Collapse,
} from "@mui/material";
import {
  ShoppingCart,
  LocalShipping,
  CheckCircle,
  Cancel,
  Pending,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import styles from "./MyOrders.module.css";
import Header from "/src/client/components/Header/Header";
import Footer from "/src/client/components/Footer/Footer";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const statusIcons = {
  pending: <Pending />,
  confirmed: <ShoppingCart />,
  shipped: <LocalShipping />,
  delivered: <CheckCircle />,
  cancelled: <Cancel />,
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/tourist/order/getOrdersByUserId/${userId}`
        );
        const data = response.data;
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [userId]);

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.put(`http://localhost:3000/tourist/order/cancel/${orderId}`);
      // Refresh the orders after cancellation
      const response = await axios.get(
        `http://localhost:3000/tourist/order/getOrdersByUserId/${userId}`
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const toggleExpand = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  // Sort orders by date (most recent first)
  const sortedOrders = [...orders].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.contentContainer}>
        <h1 className={styles.headerTitle}>My Orders</h1>
        {orders.length > 0 ? (
          <div className={styles.orderList}>
            {sortedOrders.map((order) => (
              <div key={order._id} className={styles.orderCard}>
                <div className={styles.orderDetails}>
                  <h2>Order ID: {order._id}</h2>
                  <p>Date: {formatDate(order.createdAt)}</p>
                  <p>Total Amount: {`${order.totalAmount} ${order.currency}`}</p>
                  <div className={styles.statusContainer}>
                    <Chip
                      icon={statusIcons[order.status]}
                      label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      className={styles[order.status]}
                    />
                  </div>
                  
                  <div className={styles.itemsSection}>
                    <h3>Items</h3>
                    <ul className={styles.itemsList}>
                      {order.items.map((item, index) => (
                        <li key={index}>{`${item.name} (x${item.quantity})`}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.actionsContainer}>
                    {order.status === "pending" && (
                      <button
                        className={styles.cancelButton}
                        onClick={() => handleCancelOrder(order._id)}
                      >
                        Cancel Order
                      </button>
                    )}
                    <button
                      className={styles.detailsButton}
                      onClick={() => toggleExpand(order._id)}
                    >
                      {expandedOrderId === order._id ? (
                        <>
                          <ExpandLess /> Hide Details
                        </>
                      ) : (
                        <>
                          <ExpandMore /> Show Details
                        </>
                      )}
                    </button>
                  </div>

                  <Collapse in={expandedOrderId === order._id} timeout="auto" unmountOnExit>
                    <div className={styles.expandedDetails}>
                      <h3>Order Details</h3>
                      <p>
                        <strong>Delivery Address:</strong>{" "}
                        {`${order.deliveryAddress.address}, ${order.deliveryAddress.city}, ${order.deliveryAddress.postcode}`}
                      </p>
                      <p>
                        <strong>Payment Method:</strong>{" "}
                        {order.paymentMethod.replace("_", " ").toUpperCase()}
                      </p>
                    </div>
                  </Collapse>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.productCard}>
            <h2>No orders found</h2>
            <p>Place some orders to get started!</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
