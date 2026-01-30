const express = require('express');
const mongoose = require('mongoose');
const Festival = require('../models/Festival');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all festivals (public)
router.get('/', async (req, res) => {
    try {
        // Check if mongoose is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ error: 'Database connection not ready. Please try again in a moment.' });
        }
        
        const festivals = await Festival.find({ isActive: true })
            .populate('products', 'name price image slug')
            .sort('displayOrder')
            .sort('-createdAt');
        res.json({ festivals });
    } catch (error) {
        console.error('Error fetching festivals:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch festivals' });
    }
});

// Get single festival
router.get('/:id', async (req, res) => {
    try {
        const festival = await Festival.findById(req.params.id)
            .populate('products', 'name price image slug description');

        if (!festival) {
            return res.status(404).json({ error: 'Festival not found' });
        }

        res.json({ festival });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create festival (Admin only)
router.post('/', adminAuth, async (req, res) => {
    try {
        const { name, description, image, products, startDate, endDate, displayOrder } = req.body;
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        const festival = new Festival({
            name,
            slug,
            description,
            image,
            products: products || [],
            startDate,
            endDate,
            displayOrder: displayOrder || 0
        });
        await festival.save();

        const populatedFestival = await Festival.findById(festival._id)
            .populate('products', 'name price image slug');

        res.status(201).json({ message: 'Festival created', festival: populatedFestival });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update festival (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const { name, description, image, products, startDate, endDate, isActive, displayOrder } = req.body;
        
        const updateData = {};
        if (name) {
            updateData.name = name;
            updateData.slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        }
        if (description !== undefined) updateData.description = description;
        if (image !== undefined) updateData.image = image;
        if (products !== undefined) updateData.products = products;
        if (startDate !== undefined) updateData.startDate = startDate;
        if (endDate !== undefined) updateData.endDate = endDate;
        if (isActive !== undefined) updateData.isActive = isActive;
        if (displayOrder !== undefined) updateData.displayOrder = displayOrder;

        const festival = await Festival.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('products', 'name price image slug');

        if (!festival) {
            return res.status(404).json({ error: 'Festival not found' });
        }

        res.json({ message: 'Festival updated', festival });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete festival (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const festival = await Festival.findByIdAndDelete(req.params.id);

        if (!festival) {
            return res.status(404).json({ error: 'Festival not found' });
        }

        res.json({ message: 'Festival deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
