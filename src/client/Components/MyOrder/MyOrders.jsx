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

  return (
    <div className={styles.container}>
      <Header />
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>
      {orders.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <React.Fragment key={order._id}>
                  <TableRow>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>{`${order.totalAmount} ${order.currency}`}</TableCell>
                    <TableCell>
                      <Chip
                        icon={statusIcons[order.status]}
                        label={
                          order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)
                        }
                        className={styles[order.status]}
                      />
                    </TableCell>
                    <TableCell>
                      <ul className={styles.itemsList}>
                        {order.items.map((item, index) => (
                          <li
                            key={index}
                          >{`${item.name} (x${item.quantity})`}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>
                      {order.status === "pending" && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleCancelOrder(order._id)}
                        >
                          Cancel Order
                        </Button>
                      )}
                      <Button
                        variant="text"
                        onClick={() => toggleExpand(order._id)}
                      >
                        {expandedOrderId === order._id ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Collapse
                        in={expandedOrderId === order._id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <div className={styles.details}>
                          <Typography variant="h6">Order Details:</Typography>
                          <Typography>
                            <strong>Delivery Address:</strong>{" "}
                            {`${order.deliveryAddress.address}, ${order.deliveryAddress.city}, ${order.deliveryAddress.postcode}`}
                          </Typography>
                          <Typography>
                            <strong>Payment Method:</strong>{" "}
                            {order.paymentMethod
                              .replace("_", " ")
                              .toUpperCase()}
                          </Typography>
                        </div>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6" gutterBottom>
          No orders to display.
        </Typography>
      )}
      <Footer />
    </div>
  );
}
