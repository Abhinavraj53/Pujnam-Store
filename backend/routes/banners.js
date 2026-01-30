const express = require('express');
const Banner = require('../models/Banner');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all banners (public)
router.get('/', async (req, res) => {
    try {
        const { position, active } = req.query;
        const query = {};
        
        if (position) query.position = position;
        if (active === 'true') query.is_active = true;

        const banners = await Banner.find(query)
            .sort('display_order')
            .select('-__v');
        
        res.json({ banners });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single banner
router.get('/:id', async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ error: 'Banner not found' });
        }
        res.json({ banner });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create banner (Admin only)
router.post('/', adminAuth, async (req, res) => {
    try {
        const banner = new Banner(req.body);
        await banner.save();
        res.status(201).json({ message: 'Banner created', banner });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update banner (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const banner = await Banner.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!banner) {
            return res.status(404).json({ error: 'Banner not found' });
        }
        res.json({ message: 'Banner updated', banner });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete banner (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const banner = await Banner.findByIdAndDelete(req.params.id);
        if (!banner) {
            return res.status(404).json({ error: 'Banner not found' });
        }
        res.json({ message: 'Banner deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
