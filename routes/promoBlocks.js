const express = require('express');
const PromoBlock = require('../models/PromoBlock');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all promo blocks (public - active only for frontend)
router.get('/', async (req, res) => {
    try {
        const { active } = req.query;
        const query = {};
        if (active === 'true') query.is_active = true;

        const blocks = await PromoBlock.find(query)
            .sort('display_order')
            .select('-__v');
        res.json({ blocks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single block
router.get('/:id', async (req, res) => {
    try {
        const block = await PromoBlock.findById(req.params.id);
        if (!block) {
            return res.status(404).json({ error: 'Promo block not found' });
        }
        res.json({ block });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create (Admin only)
router.post('/', adminAuth, async (req, res) => {
    try {
        const block = new PromoBlock(req.body);
        await block.save();
        res.status(201).json({ message: 'Promo block created', block });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const block = await PromoBlock.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!block) {
            return res.status(404).json({ error: 'Promo block not found' });
        }
        res.json({ message: 'Promo block updated', block });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const block = await PromoBlock.findByIdAndDelete(req.params.id);
        if (!block) {
            return res.status(404).json({ error: 'Promo block not found' });
        }
        res.json({ message: 'Promo block deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
