const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Updated path
const Order = require('../models/Order'); // Updated path

// Get monthly revenue data
router.get('/revenue', async (req, res) => {
    try {
        const revenue = await Order.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    amount: { $sum: "$totalAmount" }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            },
            {
                $limit: 6
            }
        ]);

        const formattedRevenue = revenue.map(item => ({
            month: `${item._id.year}-${item._id.month}`,
            amount: item.amount
        }));

        res.json(formattedRevenue);
    } catch (error) {
        console.error('Error in /revenue route:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get user distribution data
router.get('/users', async (req, res) => {
    try {
        const userCounts = await User.aggregate([
            {
                $group: {
                    _id: "$role",
                    count: { $sum: 1 }
                }
            }
        ]);

        const distribution = {
            tourists: 0,
            tourGuides: 0,
            sellers: 0,
            advertisers: 0
        };

        userCounts.forEach(item => {
            switch (item._id) {
                case 'Tourist':
                    distribution.tourists = item.count;
                    break;
                case 'TourGuide':
                    distribution.tourGuides = item.count;
                    break;
                case 'Seller':
                    distribution.sellers = item.count;
                    break;
                case 'Advertiser':
                    distribution.advertisers = item.count;
                    break;
            }
        });

        res.json(distribution);
    } catch (error) {
        console.error('Error in /users route:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 