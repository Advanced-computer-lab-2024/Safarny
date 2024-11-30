const express = require("express");
const Order = require("../models/Order.js");
const User = require("../models/userModel.js");

const checkout = async (req, res) => {
  try {
    const {
      userId,
      items,
      deliveryAddress,
      paymentMethod,
      totalAmount,
      currency,
    } = req.body;

    // Fetch the user's wallet balance
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // // Convert the totalAmount to the user's wallet currency if necessary
    // const exchangeRates = await fetch(process.env.VITE_EXCHANGE_API_URL).then(res => res.json());
    // const rateFrom = exchangeRates.conversion_rates[currency];
    // const rateTo = exchangeRates.conversion_rates[user.walletcurrency];
    // const convertedTotalAmount = (totalAmount / rateFrom) * rateTo;

    // Check if the user has enough funds
    if (user.wallet < totalAmount) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    // Deduct the amount from the user's wallet
    user.wallet -= totalAmount;
    await user.save();

    const newOrder = new Order({
      userId,
      items,
      deliveryAddress,
      paymentMethod,
      totalAmount,
      currency,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to save the order", details: err.message });
  }
};

// Create an order
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      items,
      deliveryAddress,
      paymentMethod,
      totalAmount,
      currency,
    } = req.body;

    const newOrder = new Order({
      userId,
      items,
      deliveryAddress,
      paymentMethod,
      totalAmount,
      currency,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create the order", details: err.message });
  }
};

// Get all orders (optionally filter by userId)
const getAllOrders = async (req, res) => {
  try {
    const { userId } = req.query; // Optional filtering by userId
    const filter = userId ? { userId } : {};
    const orders = await Order.find(filter);
    res.status(200).json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to retrieve orders", details: err.message });
  }
};

// Get a specific order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to retrieve the order", details: err.message });
  }
};

// Update an order by ID
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update the order", details: err.message });
  }
};

// Delete an order by ID
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete the order", details: err.message });
  }
};

const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const orders = await Order.find({ userId }); 

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to retrieve orders", details: err.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    switch (order.status) {
      case "pending":
        order.status = "cancelled";
        // Refund the user's wallet
        const user = await User.findById(order.userId);
        user.wallet += order.totalAmount;
        await user.save();
        await order.save();
        res.status(200).json(order);
        break;
      case "cancelled":
        res.status(400).json({ error: "Order is already cancelled" });
        break;
      case "delivered":
        res.status(400).json({ error: "Order is already delivered" });
        break;
      default:
        res.status(400).json({ error: "Cannot cancel order" });
    }
  }
  catch (err) {
    res
      .status(500)
      .json({ error: "Failed to cancel order", details: err.message });
  }
};



module.exports = {
  checkout,
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrdersByUserId,
  cancelOrder,
};
