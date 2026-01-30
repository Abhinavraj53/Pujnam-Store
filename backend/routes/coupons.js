const express = require('express');
const Coupon = require('../models/Coupon');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all active coupons (public)
router.get('/active', async (req, res) => {
    try {
        const now = new Date();
        const coupons = await Coupon.find({
            is_active: true,
            valid_from: { $lte: now },
            valid_until: { $gte: now },
            $or: [
                { usage_limit: null },
                { $expr: { $lt: ['$used_count', '$usage_limit'] } }
            ]
        }).sort('-createdAt');
        
        res.json({ coupons });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Validate coupon code
router.post('/validate', async (req, res) => {
    try {
        const { code } = req.body;
        const now = new Date();
        
        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            is_active: true,
            valid_from: { $lte: now },
            valid_until: { $gte: now }
        });

        if (!coupon) {
            return res.status(404).json({ error: 'Invalid or expired coupon' });
        }

        if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
            return res.status(400).json({ error: 'Coupon usage limit reached' });
        }

        res.json({ coupon });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all coupons (Admin)
router.get('/', adminAuth, async (req, res) => {
    try {
        const coupons = await Coupon.find().sort('-createdAt');
        res.json({ coupons });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single coupon
router.get('/:id', adminAuth, async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }
        res.json({ coupon });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create coupon (Admin only)
router.post('/', adminAuth, async (req, res) => {
    try {
        const coupon = new Coupon(req.body);
        await coupon.save();
        res.status(201).json({ message: 'Coupon created', coupon });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update coupon (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }
        res.json({ message: 'Coupon updated', coupon });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete coupon (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }
        res.json({ message: 'Coupon deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
