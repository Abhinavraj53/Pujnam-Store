const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PendingRegistration = require('../models/PendingRegistration');
const { auth } = require('../middleware/auth');
const { sendEmail } = require('../utils/emailService');

const router = express.Router();

// Generate 6-digit verification code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email using email service (Resend, Hostinger, or Gmail)
const sendVerificationEmail = async (email, code) => {
    try {
        const html = `
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
        `;
        
        console.log(`📧 Sending verification email to ${email}`);
        await sendEmail({
            to: email,
            subject: 'Email Verification Code - Pujnam Store',
            html: html
        });
        
        console.log(`✅ Verification email sent successfully to ${email}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to send verification email to ${email}:`, error.message);
        console.error('Full error:', error);
        return false;
    }
};

// Send welcome email to newly registered user
const sendWelcomeEmail = async (email, name) => {
    try {
        const Settings = require('../models/Settings');
        const storeSettings = await Settings.getSettings();
        const storeName = storeSettings.storeName || 'Pujnam Store';
        const storeEmail = storeSettings.storeEmail || 'info@pujnamstore.com';
        const storePhone = storeSettings.storePhone || '';
        const storeAddress = storeSettings.storeAddress || '';

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <div style="background: linear-gradient(135deg, #FF8C00 0%, #FF6B00 100%); padding: 40px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">Welcome to ${storeName}!</h1>
                    <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">AAPKI AASTHA KA SAARTHI</p>
                </div>
                
                <div style="padding: 40px;">
                    <h2 style="color: #FF8C00; margin-top: 0; font-size: 24px;">Namaste ${name || 'Valued Customer'}! 🙏</h2>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                        We are delighted to welcome you to <strong>${storeName}</strong> - your trusted companion in faith and spirituality.
                    </p>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                        Your account has been successfully created! You can now explore our wide range of authentic puja items, spiritual products, and sacred essentials.
                    </p>
                    
                    <div style="background: linear-gradient(135deg, #FFF5E6 0%, #FFE8CC 100%); padding: 25px; border-radius: 10px; margin: 30px 0; border-left: 4px solid #FF8C00;">
                        <h3 style="color: #1A1A1A; margin-top: 0; font-size: 20px;">What's Next?</h3>
                        <ul style="color: #374151; font-size: 15px; line-height: 1.8; padding-left: 20px;">
                            <li>Browse our collection of authentic puja kits and spiritual items</li>
                            <li>Explore special offers and festival collections</li>
                            <li>Track your orders and manage your account</li>
                            <li>Get personalized recommendations for your spiritual needs</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || 'https://pujnamstore.com'}" 
                           style="display: inline-block; background-color: #FF8C00; color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                            Start Shopping Now
                        </a>
                    </div>
                    
                    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
                        <h3 style="color: #374151; margin-top: 0; font-size: 18px;">Why Choose ${storeName}?</h3>
                        <ul style="color: #6b7280; font-size: 14px; line-height: 1.8; padding-left: 20px;">
                            <li>✅ 100% Authentic & Pure Products</li>
                            <li>✅ Direct from Traditional Artisans</li>
                            <li>✅ Fast & Secure Delivery</li>
                            <li>✅ Expert Guidance & Support</li>
                        </ul>
                    </div>
                    
                    <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-top: 30px;">
                        If you have any questions or need assistance, feel free to reach out to us. We're here to help you on your spiritual journey.
                    </p>
                    
                    <p style="color: #374151; font-size: 15px; line-height: 1.6;">
                        Once again, welcome to ${storeName}! We look forward to serving you with devotion and care.
                    </p>
                    
                    <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-top: 30px;">
                        With blessings,<br>
                        <strong style="color: #FF8C00;">The ${storeName} Team</strong>
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                    
                    <div style="text-align: center; color: #6b7280; font-size: 12px;">
                        <p style="margin: 5px 0;"><strong>Contact Us:</strong></p>
                        ${storeEmail ? `<p style="margin: 5px 0;">Email: ${storeEmail}</p>` : ''}
                        ${storePhone ? `<p style="margin: 5px 0;">Phone: ${storePhone}</p>` : ''}
                        ${storeAddress ? `<p style="margin: 5px 0;">Address: ${storeAddress}</p>` : ''}
                        <p style="margin: 20px 0 5px 0;">© ${new Date().getFullYear()} ${storeName} - Your Trusted Puja Store</p>
                        <p style="margin: 5px 0;">All rights reserved.</p>
                    </div>
                </div>
            </div>
        `;
        
        console.log(`📧 Sending welcome email to ${email}`);
        await sendEmail({
            to: email,
            subject: `Welcome to ${storeName}! Your Account is Ready 🎉`,
            html: html,
            from: storeEmail
        });
        
        console.log(`✅ Welcome email sent successfully to ${email}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to send welcome email to ${email}:`, error.message);
        console.error('Full error:', error);
        return false;
    }
};

// Send password reset OTP email with retry logic
const sendPasswordResetOTP = async (email, code, retries = 2) => {
    const smtpConfigs = 3;
    const totalAttempts = smtpConfigs * (retries + 1);
    
    for (let attempt = 0; attempt < totalAttempts; attempt++) {
        const configIndex = Math.floor(attempt / (retries + 1));
        const retryIndex = attempt % (retries + 1);
        let transporter = null;
        
        try {
            transporter = createTransporter(configIndex);
            const Settings = require('../models/Settings');
            const storeSettings = await Settings.getSettings();
            const storeName = storeSettings.storeName || 'Pujnam Store';
            
            const mailOptions = {
                from: process.env.EMAIL_USER || 'noreply@pujnamstore.com',
                to: email,
                subject: `Password Reset OTP - ${storeName}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                        <div style="background: linear-gradient(135deg, #FF8C00 0%, #FF6B00 100%); padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">${storeName}</h1>
                            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px;">AAPKI AASTHA KA SAARTHI</p>
                        </div>
                        
                        <div style="padding: 30px;">
                            <h2 style="color: #FF8C00; margin-top: 0;">Password Reset Request</h2>
                            <p>We received a request to reset your password for your ${storeName} account.</p>
                            <p>Use the following OTP to reset your password:</p>
                            
                            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                                <h1 style="color: #FF8C00; font-size: 36px; margin: 0; letter-spacing: 8px; font-weight: bold;">${code}</h1>
                            </div>
                            
                            <p style="color: #dc2626; font-weight: bold;">⚠️ This OTP will expire in 10 minutes.</p>
                            
                            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
                                <p style="margin: 0; color: #92400e;"><strong>Security Tip:</strong> If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
                            </div>
                            
                            <p>For security reasons, do not share this OTP with anyone. ${storeName} staff will never ask for your OTP.</p>
                            
                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                            <p style="color: #6b7280; font-size: 12px; text-align: center;">
                                © ${new Date().getFullYear()} ${storeName} - Your Trusted Puja Store<br>
                                This is an automated email, please do not reply.
                            </p>
                        </div>
                </div>
            `
        };
            
            // Skip verification (often fails on Render but send works)
            if (attempt === 0) {
                try {
                    const verifyPromise = transporter.verify();
                    const verifyTimeout = new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Verify timeout')), 5000)
                    );
                    await Promise.race([verifyPromise, verifyTimeout]);
                } catch (verifyError) {
                    // Continue anyway
                }
            }
            
            // Set timeout for sendMail (increased to 25 seconds)
            const sendPromise = transporter.sendMail(mailOptions);
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Email send timeout after 25 seconds')), 25000)
            );
            
            const result = await Promise.race([sendPromise, timeoutPromise]);
            console.log(`✅ Password reset OTP sent to ${email} (config ${configIndex + 1}, attempt ${retryIndex + 1})`, result.messageId || '');
            
            try {
                transporter.close();
            } catch (closeError) {}
            return true;
        } catch (error) {
            console.error(`❌ Password reset email error (config ${configIndex + 1}, attempt ${retryIndex + 1}/${totalAttempts}):`, {
                message: error.message,
                code: error.code
            });
            
            if (transporter) {
                try {
                    transporter.close();
                } catch (closeError) {}
            }
            
            if (attempt === totalAttempts - 1) {
                console.error(`❌ Failed to send password reset OTP to ${email} after ${totalAttempts} attempts`);
                return false;
            }
            
            const waitTime = 1000 * (retryIndex + 1);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
    return false;
};

// Send password change OTP email using email service
const sendPasswordChangeOTP = async (email, code, userName) => {
    try {
        const Settings = require('../models/Settings');
        const storeSettings = await Settings.getSettings();
        const storeName = storeSettings.storeName || 'Pujnam Store';
        
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <div style="background: linear-gradient(135deg, #FF8C00 0%, #FF6B00 100%); padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">${storeName}</h1>
                    <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px;">AAPKI AASTHA KA SAARTHI</p>
                </div>
                
                <div style="padding: 30px;">
                    <h2 style="color: #FF8C00; margin-top: 0;">Password Change Request</h2>
                    <p>Dear ${userName || 'Valued Customer'},</p>
                    <p>We received a request to change the password for your ${storeName} account.</p>
                    <p>Use the following OTP to change your password:</p>
                    
                    <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 25px; text-align: center; margin: 20px 0; border-radius: 8px; border: 2px solid #FF8C00;">
                        <h1 style="color: #FF8C00; font-size: 42px; margin: 0; letter-spacing: 10px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">${code}</h1>
                    </div>
                    
                    <p style="color: #dc2626; font-weight: bold; text-align: center;">⚠️ This OTP will expire in 10 minutes.</p>
                    
                    <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
                        <p style="margin: 0; color: #1e40af;"><strong>🔒 Security Information:</strong></p>
                        <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #1e40af;">
                            <li>This OTP is valid for 10 minutes only</li>
                            <li>Do not share this OTP with anyone</li>
                            <li>${storeName} staff will never ask for your OTP</li>
                            <li>If you didn't request this, please secure your account immediately</li>
                        </ul>
                    </div>
                    
                    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
                        <p style="margin: 0; color: #92400e;"><strong>⚠️ Important:</strong> If you didn't request this password change, please ignore this email and consider changing your account password immediately for security.</p>
                    </div>
                    
                    <p style="text-align: center; margin-top: 30px;">
                        <a href="#" style="background-color: #FF8C00; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Change Password</a>
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                    <p style="color: #6b7280; font-size: 12px; text-align: center;">
                        © ${new Date().getFullYear()} ${storeName} - Your Trusted Puja Store<br>
                        This is an automated email, please do not reply.<br>
                        For support, contact: ${storeSettings.storeEmail || 'support@pujnamstore.com'}
                    </p>
                </div>
            </div>
        `;
        
        await sendEmail({
            to: email,
            subject: `Password Change OTP - ${storeName}`,
            html: html
        });
        
        return true;
    } catch (error) {
        console.error(`❌ Failed to send password change OTP to ${email}:`, error.message);
        return false;
    }
};

// Register - Store in pending registration, account will be created only after OTP verification
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, phone } = req.body;

        // Check if user already exists (verified or unverified account)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (existingUser.emailVerified) {
                return res.status(400).json({ error: 'Email already registered. Please login instead.' });
            } else {
                // Unverified account exists - delete it (user needs to register again and verify)
                await User.deleteOne({ email });
                console.log(`Deleted unverified account: ${email}`);
            }
        }

        // Check if there's already a pending registration for this email
        const existingPending = await PendingRegistration.findOne({ email });
        if (existingPending) {
            // Delete old pending registration
            await PendingRegistration.deleteOne({ email });
        }

        // Generate verification code
        const verificationCode = generateVerificationCode();
        const codeExpiry = new Date();
        codeExpiry.setMinutes(codeExpiry.getMinutes() + 10); // Code expires in 10 minutes

        // Store registration data in pending registration (NOT in User collection)
        const pendingRegistration = new PendingRegistration({ 
            email, 
            password, 
            name, 
            phone,
            emailVerificationCode: verificationCode,
            emailVerificationCodeExpiry: codeExpiry
        });
        await pendingRegistration.save();

        // Send verification email
        console.log(`📧 Attempting to send verification email to ${email}`);
        const emailSent = await sendVerificationEmail(email, verificationCode);
        
        if (!emailSent) {
            // If email fails, delete pending registration
            await PendingRegistration.deleteOne({ email });
            console.error(`❌ Registration failed for ${email} - email sending failed`);
            return res.status(500).json({ 
                error: 'Failed to send verification email. Please check your email service configuration and try again.',
                details: process.env.NODE_ENV === 'development' ? 'Check server logs for detailed error information' : undefined
            });
        }
        
        console.log(`✅ Verification email sent successfully to ${email}`);

        res.status(201).json({
            message: 'Verification code sent to your email. Please verify to complete registration.',
            requiresVerification: true,
            email: email,
            note: 'Your account will be created only after email verification. Please check your email for the OTP.'
        });
    } catch (error) {
        console.error('Registration error:', error);
        // Clean up on error
        if (req.body.email) {
            await PendingRegistration.deleteOne({ email: req.body.email }).catch(() => {});
        }
        res.status(500).json({ error: error.message || 'Registration failed. Please try again.' });
    }
});

// Send verification code (for pending registrations only)
router.post('/send-verification-code', async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user already exists and is verified
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (existingUser.emailVerified) {
                return res.status(400).json({ error: 'Email already verified. Please login.' });
            } else {
                return res.status(400).json({ error: 'Account already exists but not verified. Please verify your email or contact support.' });
        }
        }

        // Check for pending registration
        const pendingRegistration = await PendingRegistration.findOne({ email });
        if (!pendingRegistration) {
            return res.status(404).json({ 
                error: 'No pending registration found. Please register again.' 
            });
        }

        // Generate new verification code
        const verificationCode = generateVerificationCode();
        const codeExpiry = new Date();
        codeExpiry.setMinutes(codeExpiry.getMinutes() + 10);

        pendingRegistration.emailVerificationCode = verificationCode;
        pendingRegistration.emailVerificationCodeExpiry = codeExpiry;
        await pendingRegistration.save();

        // Send verification email
        const emailSent = await sendVerificationEmail(email, verificationCode);
        
        if (!emailSent) {
            return res.status(500).json({ 
                error: 'Failed to send verification email. Please try again.' 
            });
        }

        res.json({ 
            message: 'Verification code sent to your email',
            note: 'If you don\'t receive the email, please check your spam folder or try again.'
        });
    } catch (error) {
        console.error('Send verification code error:', error);
        res.status(500).json({ error: error.message || 'Failed to send verification code' });
    }
});

// Verify email and create account (only after OTP verification)
router.post('/verify-email', async (req, res) => {
    try {
        const { email, code } = req.body;

        // Check if user already exists (should not happen, but safety check)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (existingUser.emailVerified) {
                // Generate token for already verified user
                const token = jwt.sign(
                    { userId: existingUser._id },
                    process.env.JWT_SECRET,
                    { expiresIn: '7d' }
                );
                return res.json({
                    message: 'Email already verified',
                    user: {
                        id: existingUser._id,
                        email: existingUser.email,
                        name: existingUser.name,
                        role: existingUser.role,
                        emailVerified: true
                    },
                    token
                });
            } else {
                return res.status(400).json({ 
                    error: 'Account exists but not verified. Please contact support.' 
                });
        }
        }

        // Find pending registration
        const pendingRegistration = await PendingRegistration.findOne({ email });
        if (!pendingRegistration) {
            return res.status(404).json({ 
                error: 'No pending registration found. Please register again.' 
            });
        }

        // Check if code matches
        if (pendingRegistration.emailVerificationCode !== code) {
            return res.status(400).json({ error: 'Invalid verification code' });
        }

        // Check if code expired
        if (new Date() > pendingRegistration.emailVerificationCodeExpiry) {
            // Delete expired pending registration
            await PendingRegistration.deleteOne({ email });
            return res.status(400).json({ 
                error: 'Verification code expired. Please register again.' 
            });
        }

        // Create the actual user account (ONLY after OTP verification)
        const user = new User({
            email: pendingRegistration.email,
            password: pendingRegistration.password, // Already hashed
            name: pendingRegistration.name,
            phone: pendingRegistration.phone,
            emailVerified: true, // Mark as verified since OTP is verified
            emailVerificationCode: null,
            emailVerificationCodeExpiry: null
        });
        await user.save();

        // Delete pending registration after successful account creation
        await PendingRegistration.deleteOne({ email });

        // Send welcome email to the newly created user
        try {
            await sendWelcomeEmail(user.email, user.name);
        } catch (emailError) {
            // Don't fail account creation if welcome email fails, just log it
            console.error('Failed to send welcome email:', emailError);
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Email verified successfully. Your account has been created!',
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
        console.error('Verify email error:', error);
        
        // If user creation fails but pending registration exists, clean it up
        if (req.body.email) {
            await PendingRegistration.deleteOne({ email: req.body.email }).catch(() => {});
        }
        
        res.status(500).json({ 
            error: error.message || 'Failed to verify email. Please try again.' 
        });
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

// Forgot Password - Request OTP
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Find user by email (only verified users can reset password)
        const user = await User.findOne({ 
            email: email.toLowerCase().trim(),
            emailVerified: true // Only allow password reset for verified accounts
        });
        
        // Check if account exists - show error if not found
        if (!user) {
            // Also check if there's a pending registration
            const pendingRegistration = await PendingRegistration.findOne({ email: email.toLowerCase().trim() });
            
            if (pendingRegistration) {
                return res.status(400).json({ 
                    error: 'Account not verified yet. Please verify your email first to complete registration.' 
                });
            }
            
            // No account found
            return res.status(404).json({ 
                error: 'No account found with this email address. Please check your email or register a new account.' 
            });
        }

        // Generate 6-digit OTP
        const resetOTP = generateVerificationCode();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // OTP expires in 10 minutes

        // Save OTP and expiry to user
        user.passwordResetOTP = resetOTP;
        user.passwordResetOTPExpiry = otpExpiry;
        await user.save();

        // Send password reset OTP email
        const emailSent = await sendPasswordResetOTP(user.email, resetOTP);
        
        if (!emailSent) {
            // Clear OTP if email failed
            user.passwordResetOTP = null;
            user.passwordResetOTPExpiry = null;
            await user.save();
            return res.status(500).json({ error: 'Failed to send password reset email. Please try again later.' });
        }

        res.json({ 
            message: 'Password reset OTP has been sent to your email address.',
            email: user.email
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: error.message || 'Failed to process password reset request' });
    }
});

// Reset Password - Verify OTP and Reset Password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Validate input
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ error: 'Email, OTP, and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if OTP exists
        if (!user.passwordResetOTP) {
            return res.status(400).json({ error: 'No password reset request found. Please request a new OTP.' });
        }

        // Verify OTP
        if (user.passwordResetOTP !== otp) {
            return res.status(400).json({ error: 'Invalid OTP. Please check and try again.' });
        }

        // Check if OTP expired
        if (new Date() > user.passwordResetOTPExpiry) {
            // Clear expired OTP
            user.passwordResetOTP = null;
            user.passwordResetOTPExpiry = null;
            await user.save();
            return res.status(400).json({ error: 'OTP has expired. Please request a new password reset.' });
        }

        // Reset password
        user.password = newPassword; // Will be hashed by pre-save hook
        user.passwordResetOTP = null;
        user.passwordResetOTPExpiry = null;
        await user.save();

        res.json({ 
            message: 'Password reset successfully. You can now login with your new password.' 
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: error.message || 'Failed to reset password' });
    }
});

// Resend Password Reset OTP
router.post('/resend-password-reset-otp', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        
        // For security, don't reveal if email exists
        if (!user) {
            return res.json({ 
                message: 'If an account exists with this email, a password reset OTP has been sent.' 
            });
        }

        // Generate new OTP
        const resetOTP = generateVerificationCode();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

        // Save new OTP
        user.passwordResetOTP = resetOTP;
        user.passwordResetOTPExpiry = otpExpiry;
        await user.save();

        // Send email
        const emailSent = await sendPasswordResetOTP(user.email, resetOTP);
        
        if (!emailSent) {
            user.passwordResetOTP = null;
            user.passwordResetOTPExpiry = null;
            await user.save();
            return res.status(500).json({ error: 'Failed to send password reset email. Please try again later.' });
        }

        res.json({ 
            message: 'If an account exists with this email, a password reset OTP has been sent.' 
        });
    } catch (error) {
        console.error('Resend password reset OTP error:', error);
        res.status(500).json({ error: error.message || 'Failed to resend password reset OTP' });
    }
});

// Change Password - Request OTP (Authenticated Users)
router.post('/change-password/request-otp', auth, async (req, res) => {
    try {
        // User is already authenticated via auth middleware
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate 6-digit OTP for password change
        const changeOTP = generateVerificationCode();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // OTP expires in 10 minutes

        // Save OTP and expiry to user
        user.passwordChangeOTP = changeOTP;
        user.passwordChangeOTPExpiry = otpExpiry;
        await user.save();

        // Send password change OTP email
        const emailSent = await sendPasswordChangeOTP(user.email, changeOTP, user.name);
        
        if (!emailSent) {
            // Clear OTP if email failed
            user.passwordChangeOTP = null;
            user.passwordChangeOTPExpiry = null;
            await user.save();
            return res.status(500).json({ error: 'Failed to send password change OTP email. Please try again later.' });
        }

        res.json({ 
            message: 'Password change OTP has been sent to your email address.',
            email: user.email
        });
    } catch (error) {
        console.error('Change password request OTP error:', error);
        res.status(500).json({ error: error.message || 'Failed to process password change request' });
    }
});

// Change Password - Verify OTP and Change Password (Authenticated Users)
router.post('/change-password', auth, async (req, res) => {
    try {
        const { otp, newPassword } = req.body;

        // Validate input
        if (!otp || !newPassword) {
            return res.status(400).json({ error: 'OTP and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        // Get authenticated user
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if OTP exists
        if (!user.passwordChangeOTP) {
            return res.status(400).json({ error: 'No password change request found. Please request a new OTP.' });
        }

        // Verify OTP
        if (user.passwordChangeOTP !== otp) {
            return res.status(400).json({ error: 'Invalid OTP. Please check and try again.' });
        }

        // Check if OTP expired
        if (new Date() > user.passwordChangeOTPExpiry) {
            // Clear expired OTP
            user.passwordChangeOTP = null;
            user.passwordChangeOTPExpiry = null;
            await user.save();
            return res.status(400).json({ error: 'OTP has expired. Please request a new password change OTP.' });
        }

        // Change password
        user.password = newPassword; // Will be hashed by pre-save hook
        user.passwordChangeOTP = null;
        user.passwordChangeOTPExpiry = null;
        await user.save();

        res.json({ 
            message: 'Password changed successfully. Please login with your new password.' 
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: error.message || 'Failed to change password' });
    }
});

// Resend Password Change OTP (Authenticated Users)
router.post('/change-password/resend-otp', auth, async (req, res) => {
    try {
        // User is already authenticated via auth middleware
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate new OTP
        const changeOTP = generateVerificationCode();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

        // Save new OTP
        user.passwordChangeOTP = changeOTP;
        user.passwordChangeOTPExpiry = otpExpiry;
        await user.save();

        // Send email
        const emailSent = await sendPasswordChangeOTP(user.email, changeOTP, user.name);
        
        if (!emailSent) {
            user.passwordChangeOTP = null;
            user.passwordChangeOTPExpiry = null;
            await user.save();
            return res.status(500).json({ error: 'Failed to send password change OTP email. Please try again later.' });
        }

        res.json({ 
            message: 'Password change OTP has been resent to your email address.',
            email: user.email
        });
    } catch (error) {
        console.error('Resend password change OTP error:', error);
        res.status(500).json({ error: error.message || 'Failed to resend password change OTP' });
    }
});

module.exports = router;
