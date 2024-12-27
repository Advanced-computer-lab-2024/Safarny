import React, { useState, useEffect } from "react";
import {
  Chip,
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
import { FaBox, FaMapMarkerAlt, FaCreditCard, FaCalendar, FaDollarSign } from 'react-icons/fa';
import styles from "./MyOrders.module.css";
import Header from "/src/client/components/Header/Header";
import Footer from "/src/client/components/Footer/Footer";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const statusIcons = {
  pending: <Pending className="text-warning" />,
  confirmed: <ShoppingCart className="text-info" />,
  shipped: <LocalShipping className="text-primary" />,
  delivered: <CheckCircle className="text-success" />,
  cancelled: <Cancel className="text-danger" />,
};

const statusClasses = {
  pending: "bg-warning",
  confirmed: "bg-info",
  shipped: "bg-primary",
  delivered: "bg-success",
  cancelled: "bg-danger",
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/tourist/order/getOrdersByUserId/${userId}`
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.put(`/tourist/order/cancel/${orderId}`);
      const response = await axios.get(
        `/tourist/order/getOrdersByUserId/${userId}`
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

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      <main className={styles.mainContent}>
        <div className={`${styles.titleSection}`}>
          <div className="container text-center py-5">
            <h1 className="display-4 mb-3 text-black">My Orders</h1>
          </div>
        </div>

        <div className="container py-5">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
              <p className="mt-3 text-muted">Loading your orders...</p>
            </div>
          ) : sortedOrders.length > 0 ? (
            <div className="row g-4">
              {sortedOrders.map((order) => (
                <div key={order._id} className="col-12">
                  <div className={`${styles.orderCard} card shadow-sm`}>
                    <div className="card-body p-4">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <div className="d-flex align-items-center mb-3">
                            <FaBox className="text-primary me-2" size={24} />
                            <h5 className="mb-0">Order #{order._id.slice(-8)}</h5>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <FaCalendar className="text-muted me-2" />
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                          <div className="d-flex align-items-center">
                            <FaDollarSign className="text-muted me-2" />
                            <span className="fw-bold">{`${order.totalAmount} ${order.currency}`}</span>
                          </div>
                        </div>
                        
                        <div className="col-md-6 text-md-end mt-3 mt-md-0">
                          <span className={`badge ${statusClasses[order.status]} ${styles.statusBadge}`}>
                            {statusIcons[order.status]}
                            <span className="ms-2">
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className={`${styles.itemsList} mt-4`}>
                        <h6 className="mb-3 fw-bold">Order Items</h6>
                        <div className="row g-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="col-md-6 col-lg-4">
                              <div className={styles.itemCard}>
                                <span className="fw-bold">{item.name}</span>
                                <span className="badge bg-secondary ms-2">x{item.quantity}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 d-flex gap-2">
                        <button
                          className={`btn btn-outline-primary ${styles.actionButton}`}
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
                        
                        {order.status === "pending" && (
                          <button
                            className={`btn btn-danger ${styles.actionButton}`}
                            onClick={() => handleCancelOrder(order._id)}
                          >
                            <Cancel className="me-1" /> Cancel Order
                          </button>
                        )}
                      </div>

                      <Collapse in={expandedOrderId === order._id}>
                        <div className={`${styles.expandedDetails} mt-4`}>
                          <div className="row g-4">
                            <div className="col-md-6">
                              <div className={styles.detailsSection}>
                                <h6 className="mb-3">
                                  <FaMapMarkerAlt className="me-2" />
                                  Delivery Address
                                </h6>
                                <p className="mb-0">
                                  {`${order.deliveryAddress.address}, ${order.deliveryAddress.city}, ${order.deliveryAddress.postcode}`}
                                </p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className={styles.detailsSection}>
                                <h6 className="mb-3">
                                  <FaCreditCard className="me-2" />
                                  Payment Method
                                </h6>
                                <p className="mb-0">
                                  {order.paymentMethod.replace("_", " ").toUpperCase()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Collapse>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <FaBox className="display-1 text-muted mb-3" />
              <h3>No Orders Found</h3>
              <p className="text-white">Start shopping to see your orders here!</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
