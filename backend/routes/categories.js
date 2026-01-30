const express = require('express');
const mongoose = require('mongoose');
const Category = require('../models/Category');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
    try {
        // Check if mongoose is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ error: 'Database connection not ready. Please try again in a moment.' });
        }
        
        const categories = await Category.find({ isActive: true })
            .populate('parent', 'name slug')
            .sort('name');
        res.json({ categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch categories' });
    }
});

// Get single category
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id).populate('parent', 'name slug');

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json({ category });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create category (Admin only)
router.post('/', adminAuth, async (req, res) => {
    try {
        const { name, description, image, parent } = req.body;
        const slug = name.toLowerCase().replace(/\s+/g, '-');

        const category = new Category({ name, slug, description, image, parent });
        await category.save();

        res.status(201).json({ message: 'Category created', category });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update category (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const { name, description, image, parent, isActive } = req.body;
        const slug = name ? name.toLowerCase().replace(/\s+/g, '-') : undefined;

        const updateData = { name, slug, description, image, parent, isActive };
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json({ message: 'Category updated', category });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete category (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
