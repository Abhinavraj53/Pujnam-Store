const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id })
            .populate('items.product', 'name price images stock');

        if (!cart) {
            cart = { items: [], total: 0 };
        } else {
            // Calculate total
            let total = 0;
            cart.items.forEach(item => {
                if (item.product) {
                    total += item.product.price * item.quantity;
                }
            });
            cart = { ...cart.toObject(), total };
        }

        res.json({ cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        // Check if product exists and has stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            // Create new cart
            cart = new Cart({
                user: req.user._id,
                items: [{ product: productId, quantity }]
            });
        } else {
            // Check if product already in cart
            const existingItem = cart.items.find(
                item => item.product.toString() === productId
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }
        }

        await cart.save();
        await cart.populate('items.product', 'name price images stock');

        res.json({ message: 'Item added to cart', cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update item quantity
router.put('/update', auth, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ error: 'Quantity must be at least 1' });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const item = cart.items.find(
            item => item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({ error: 'Item not in cart' });
        }

        // Check stock
        const product = await Product.findById(productId);
        if (product.stock < quantity) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }

        item.quantity = quantity;
        await cart.save();
        await cart.populate('items.product', 'name price images stock');

        res.json({ message: 'Cart updated', cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove item from cart
router.delete('/remove/:productId', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== req.params.productId
        );

        await cart.save();
        await cart.populate('items.product', 'name price images stock');

        res.json({ message: 'Item removed from cart', cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
    try {
        await Cart.findOneAndDelete({ user: req.user._id });
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
