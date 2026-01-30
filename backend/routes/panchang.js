const express = require('express');
const Panchang = require('../models/Panchang');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Fetch panchang from Free Astrology API
// API Reference: https://freeastrologyapi.com/api-reference/complete-panchang
router.post('/fetch', async (req, res) => {
    try {
        const { latitude, longitude, timezone, year, month, date, hours, minutes, seconds } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const API_KEY = process.env.FREE_ASTROLOGY_API_KEY || '';
        if (!API_KEY) {
            // Return a graceful error instead of 500, allow frontend to handle it
            return res.status(200).json({ 
                panchang: null,
                error: 'Free Astrology API key not configured',
                message: 'Panchang data is not available. Please configure FREE_ASTROLOGY_API_KEY in backend/.env'
            });
        }

        // Get current date/time if not provided
        const now = new Date();
        const requestBody = {
            year: year || now.getFullYear(),
            month: month || now.getMonth() + 1, // 1-12 (no leading zero)
            date: date || now.getDate(), // 1-31 (no leading zero)
            hours: hours !== undefined ? hours : now.getHours(), // 0-23 (no leading zero)
            minutes: minutes !== undefined ? minutes : now.getMinutes(), // 0-59 (no leading zero)
            seconds: seconds !== undefined ? seconds : now.getSeconds(), // 0-59 (no leading zero)
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            timezone: timezone || 5.5, // Default to IST (5.5)
            config: {
                observation_point: 'topocentric',
                ayanamsha: 'lahiri'
            }
        };

        // Call Free Astrology API
        // Documentation: https://freeastrologyapi.com/api-reference/complete-panchang
        const response = await fetch('https://json.freeastrologyapi.com/complete-panchang', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Free Astrology API error:', errorText);
            return res.status(response.status).json({ 
                error: 'Failed to fetch panchang data from Free Astrology API',
                details: errorText,
                status: response.status
            });
        }

        const data = await response.json();
        
        // Return the complete panchang data
        res.json({ 
            panchang: data,
            success: true
        });
    } catch (error) {
        console.error('Error fetching panchang:', error);
        res.status(500).json({ 
            error: error.message || 'Internal server error',
            message: 'Failed to connect to Free Astrology API'
        });
    }
});

// Get today's panchang
router.get('/today', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const panchang = await Panchang.findOne({ date: today });
        
        if (!panchang) {
            return res.json({ panchang: null, message: 'Panchang not available for today' });
        }
        
        res.json({ panchang });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get panchang by date
router.get('/date/:date', async (req, res) => {
    try {
        const panchang = await Panchang.findOne({ date: req.params.date });
        if (!panchang) {
            return res.status(404).json({ error: 'Panchang not found for this date' });
        }
        res.json({ panchang });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all panchang (Admin)
router.get('/', adminAuth, async (req, res) => {
    try {
        const panchang = await Panchang.find().sort('-date').limit(100);
        res.json({ panchang });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create panchang (Admin only)
router.post('/', adminAuth, async (req, res) => {
    try {
        const panchang = new Panchang(req.body);
        await panchang.save();
        res.status(201).json({ message: 'Panchang created', panchang });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update panchang (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const panchang = await Panchang.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!panchang) {
            return res.status(404).json({ error: 'Panchang not found' });
        }
        res.json({ message: 'Panchang updated', panchang });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete panchang (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const panchang = await Panchang.findByIdAndDelete(req.params.id);
        if (!panchang) {
            return res.status(404).json({ error: 'Panchang not found' });
        }
        res.json({ message: 'Panchang deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
