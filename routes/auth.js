const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const nodemailer = require('nodemailer');

const router = express.Router();

// Generate 6-digit verification code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Email transporter configuration
const createTransporter = () => {
    // Using Gmail SMTP (you can configure with your email service)
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'your-email@gmail.com',
            pass: process.env.EMAIL_PASSWORD || 'your-app-password'
        }
    });
};

// Send verification email
const sendVerificationEmail = async (email, code) => {
    try {
        const transporter = createTransporter();
        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@pujnamstore.com',
            to: email,
            subject: 'Email Verification Code - Pujnam Store',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #FF8C00;">Email Verification</h2>
                    <p>Thank you for registering with Pujnam Store!</p>
                    <p>Your verification code is:</p>
                    <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #FF8C00; font-size: 32px; margin: 0; letter-spacing: 5px;">${code}</h1>
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't create an account, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                    <p style="color: #6b7280; font-size: 12px;">© Pujnam Store - Your Trusted Puja Store</p>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email sending error:', error);
        return false;
    }
};

// Register (without email verification - verification code will be sent)
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, phone } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Generate verification code
        const verificationCode = generateVerificationCode();
        const codeExpiry = new Date();
        codeExpiry.setMinutes(codeExpiry.getMinutes() + 10); // Code expires in 10 minutes

        // Create new user (not verified yet)
        const user = new User({ 
            email, 
            password, 
            name, 
            phone,
            emailVerified: false,
            emailVerificationCode: verificationCode,
            emailVerificationCodeExpiry: codeExpiry
        });
        await user.save();

        // Send verification email
        const emailSent = await sendVerificationEmail(email, verificationCode);
        if (!emailSent) {
            // If email fails, still save user but log error
            console.error('Failed to send verification email to:', email);
        }

        res.status(201).json({
            message: 'Registration successful. Please verify your email.',
            requiresVerification: true,
            email: user.email
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Send verification code
router.post('/send-verification-code', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.emailVerified) {
            return res.status(400).json({ error: 'Email already verified' });
        }

        // Generate new verification code
        const verificationCode = generateVerificationCode();
        const codeExpiry = new Date();
        codeExpiry.setMinutes(codeExpiry.getMinutes() + 10);

        user.emailVerificationCode = verificationCode;
        user.emailVerificationCodeExpiry = codeExpiry;
        await user.save();

        // Send verification email
        const emailSent = await sendVerificationEmail(email, verificationCode);
        if (!emailSent) {
            return res.status(500).json({ error: 'Failed to send verification email' });
        }

        res.json({ message: 'Verification code sent to your email' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Verify email
router.post('/verify-email', async (req, res) => {
    try {
        const { email, code } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.emailVerified) {
            return res.status(400).json({ error: 'Email already verified' });
        }

        // Check if code matches
        if (user.emailVerificationCode !== code) {
            return res.status(400).json({ error: 'Invalid verification code' });
        }

        // Check if code expired
        if (new Date() > user.emailVerificationCodeExpiry) {
            return res.status(400).json({ error: 'Verification code expired. Please request a new one.' });
        }

        // Verify email
        user.emailVerified = true;
        user.emailVerificationCode = null;
        user.emailVerificationCodeExpiry = null;
        await user.save();

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Email verified successfully',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                emailVerified: true
            },
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check if email is verified (skip for admin users)
        if (!user.emailVerified && user.role !== 'admin') {
            return res.status(403).json({ 
                error: 'Email not verified. Please verify your email first.',
                requiresVerification: true,
                email: user.email
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                emailVerified: user.emailVerified
            },
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get current user
router.get('/me', auth, async (req, res) => {
    try {
        res.json({
            user: {
                id: req.user._id,
                email: req.user.email,
                name: req.user.name,
                phone: req.user.phone,
                address: req.user.address,
                role: req.user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, phone, address } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, phone, address },
            { new: true }
        ).select('-password');

        res.json({ message: 'Profile updated', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Address Management Routes

// Helper function to ensure addresses field exists
const ensureAddressesField = async (userId) => {
    const user = await User.findById(userId);
    if (user && !user.addresses) {
        user.addresses = [];
        await user.save();
    }
    return user;
};

// Get all addresses
router.get('/addresses', auth, async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Ensure addresses field exists
        await ensureAddressesField(req.user._id);

        const user = await User.findById(req.user._id).select('addresses');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Ensure addresses is an array (handle case where field doesn't exist)
        const addresses = Array.isArray(user.addresses) ? user.addresses : [];
        res.json({ addresses });
    } catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to fetch addresses',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Add new address
router.post('/addresses', auth, async (req, res) => {
    try {
        // Ensure addresses field exists
        await ensureAddressesField(req.user._id);

        const addressData = req.body;
        
        // If this is set as default, unset other defaults
        if (addressData.isDefault) {
            await User.updateOne(
                { _id: req.user._id, addresses: { $exists: true, $ne: [] } },
                { $set: { 'addresses.$[].isDefault': false } }
            );
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $push: { addresses: addressData } },
            { new: true, upsert: false }
        ).select('addresses');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(201).json({ 
            message: 'Address added successfully',
            address: user.addresses[user.addresses.length - 1]
        });
    } catch (error) {
        console.error('Error adding address:', error);
        res.status(500).json({ error: error.message || 'Failed to add address' });
    }
});

// Update address
router.put('/addresses/:addressId', auth, async (req, res) => {
    try {
        // Ensure addresses field exists
        await ensureAddressesField(req.user._id);

        const { addressId } = req.params;
        const addressData = req.body;

        // If this is set as default, unset other defaults
        if (addressData.isDefault) {
            await User.updateOne(
                { _id: req.user._id, addresses: { $exists: true, $ne: [] } },
                { $set: { 'addresses.$[].isDefault': false } }
            );
        }

        const user = await User.findOneAndUpdate(
            { _id: req.user._id, 'addresses._id': addressId },
            { $set: { 'addresses.$': { ...addressData, _id: addressId } } },
            { new: true }
        ).select('addresses');

        if (!user) {
            return res.status(404).json({ error: 'Address not found' });
        }

        res.json({ message: 'Address updated successfully', address: user.addresses.find(a => a._id.toString() === addressId) });
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ error: error.message || 'Failed to update address' });
    }
});

// Delete address
router.delete('/addresses/:addressId', auth, async (req, res) => {
    try {
        // Ensure addresses field exists
        await ensureAddressesField(req.user._id);

        const { addressId } = req.params;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { addresses: { _id: addressId } } },
            { new: true }
        ).select('addresses');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Address deleted successfully', addresses: user.addresses || [] });
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ error: error.message || 'Failed to delete address' });
    }
});

// Set default address
router.put('/addresses/:addressId/default', auth, async (req, res) => {
    try {
        // Ensure addresses field exists
        await ensureAddressesField(req.user._id);

        const { addressId } = req.params;

        // Unset all defaults (only if addresses array exists and is not empty)
        await User.updateOne(
            { _id: req.user._id, addresses: { $exists: true, $ne: [] } },
            { $set: { 'addresses.$[].isDefault': false } }
        );

        // Set this address as default
        const user = await User.findOneAndUpdate(
            { _id: req.user._id, 'addresses._id': addressId },
            { $set: { 'addresses.$.isDefault': true } },
            { new: true }
        ).select('addresses');

        if (!user) {
            return res.status(404).json({ error: 'Address not found' });
        }

        res.json({ message: 'Default address updated', addresses: user.addresses || [] });
    } catch (error) {
        console.error('Error setting default address:', error);
        res.status(500).json({ error: error.message || 'Failed to set default address' });
    }
});

module.exports = router;
