const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all customers (Admin only)
router.get('/', adminAuth, async (req, res) => {
    try {
        const users = await User.find({ role: 'user' })
            .select('-password')
            .sort('-createdAt');

        // Get order statistics for each customer
        const customersWithStats = await Promise.all(
            users.map(async (user) => {
                const orders = await Order.find({ user: user._id });
                const totalOrders = orders.length;
                const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
                const lastOrder = orders.length > 0 
                    ? orders.sort((a, b) => b.createdAt - a.createdAt)[0].createdAt 
                    : null;

                return {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    phone: user.phone,
                    address: user.address,
                    city: user.address?.city,
                    state: user.address?.state,
                    pincode: user.address?.zipCode,
                    total_orders: totalOrders,
                    total_spent: totalSpent,
                    created_at: user.createdAt,
                    last_order_at: lastOrder
                };
            })
        );

        res.json({ customers: customersWithStats });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single customer (Admin only)
router.get('/:id', adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const orders = await Order.find({ user: user._id })
            .populate('items.product', 'name images price')
            .sort('-createdAt');

        res.json({
            customer: {
                id: user._id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                address: user.address,
                created_at: user.createdAt
            },
            orders
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
