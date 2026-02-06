const express = require('express');
const SectionVideo = require('../models/SectionVideo');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all (public - active only for frontend)
router.get('/', async (req, res) => {
    try {
        const { active } = req.query;
        const query = {};
        if (active === 'true') query.is_active = true;

        const videos = await SectionVideo.find(query)
            .sort('display_order')
            .select('-__v');
        res.json({ videos });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get one
router.get('/:id', async (req, res) => {
    try {
        const video = await SectionVideo.findById(req.params.id);
        if (!video) return res.status(404).json({ error: 'Video not found' });
        res.json({ video });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create (Admin)
router.post('/', adminAuth, async (req, res) => {
    try {
        const video = new SectionVideo(req.body);
        await video.save();
        res.status(201).json({ message: 'Video added', video });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update (Admin)
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const video = await SectionVideo.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!video) return res.status(404).json({ error: 'Video not found' });
        res.json({ message: 'Video updated', video });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const video = await SectionVideo.findByIdAndDelete(req.params.id);
        if (!video) return res.status(404).json({ error: 'Video not found' });
        res.json({ message: 'Video deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
