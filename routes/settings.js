const express = require('express');
const Settings = require('../models/Settings');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get settings (public)
router.get('/', async (req, res) => {
    try {
        const settings = await Settings.getSettings();
        res.json({ settings });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update settings (admin only)
router.put('/', adminAuth, async (req, res) => {
    try {
        let settings = await Settings.findOne();
        
        if (!settings) {
            settings = new Settings(req.body);
        } else {
            Object.assign(settings, req.body);
            settings.updatedAt = Date.now();
        }
        
        await settings.save();
        res.json({ message: 'Settings updated successfully', settings });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
