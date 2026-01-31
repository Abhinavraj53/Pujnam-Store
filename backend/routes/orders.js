const express = require('express');
const nodemailer = require('nodemailer');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Email transporter configuration with timeout and connection settings
const createTransporter = () => {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASSWORD;
    
    if (!emailUser || !emailPass) {
        console.error('❌ EMAIL_USER or EMAIL_PASSWORD not set in environment variables');
        throw new Error('Email configuration missing');
    }

    const useSSL = process.env.EMAIL_USE_SSL !== 'false'; // Default to SSL
    
    return nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: useSSL ? 465 : 587,
        secure: useSSL, // true for 465, false for 587
        auth: {
            user: emailUser,
            pass: emailPass
        },
        // Connection timeout settings for Render (reduced for faster failure)
        connectionTimeout: 20000, // 20 seconds
        greetingTimeout: 10000, // 10 seconds
        socketTimeout: 20000, // 20 seconds
        // Retry settings
        pool: false, // Disable pooling for better reliability
        // Additional options for better reliability
        tls: {
            rejectUnauthorized: false,
            ciphers: 'SSLv3'
        },
        debug: process.env.EMAIL_DEBUG === 'true',
        logger: process.env.EMAIL_DEBUG === 'true'
    });
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (order, customerEmail, customerName) => {
    try {
        if (!customerEmail) {
            console.log('No email provided for order confirmation');
            return false;
        }

        const transporter = createTransporter();
        const Settings = require('../models/Settings');
        const storeSettings = await Settings.getSettings();
        const storeName = storeSettings.storeName || 'Pujnam Store';
        const storeEmail = storeSettings.storeEmail || 'info@pujnamstore.com';

        // Format order items for email
        const itemsHtml = order.items.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${item.price.toFixed(2)}</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
        `).join('');

        const mailOptions = {
            from: process.env.EMAIL_USER || storeEmail,
            to: customerEmail,
            subject: `Order Confirmation - Order #${order._id.toString().slice(-8)} - ${storeName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                    <div style="background: linear-gradient(135deg, #FF8C00 0%, #FF6B00 100%); padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">${storeName}</h1>
                        <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px;">AAPKI AASTHA KA SAARTHI</p>
                    </div>
                    
                    <div style="padding: 30px;">
                        <h2 style="color: #FF8C00; margin-top: 0;">Order Confirmation</h2>
                        <p>Dear ${customerName || 'Valued Customer'},</p>
                        <p>Thank you for your order! We have received your order and it is being processed.</p>
                        
                        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #374151; margin-top: 0;">Order Details</h3>
                            <p style="margin: 5px 0;"><strong>Order ID:</strong> #${order._id.toString().slice(-8)}</p>
                            <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}</p>
                            <p style="margin: 5px 0;"><strong>Order Status:</strong> <span style="color: #059669; font-weight: bold;">${order.orderStatus.toUpperCase()}</span></p>
                            <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
                            <p style="margin: 5px 0;"><strong>Payment Status:</strong> ${order.paymentStatus.toUpperCase()}</p>
                        </div>

                        <h3 style="color: #374151; margin-top: 30px;">Order Items</h3>
                        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                            <thead>
                                <tr style="background-color: #f3f4f6;">
                                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Product</th>
                                    <th style="padding: 10px; text-align: center; border-bottom: 2px solid #e5e7eb;">Quantity</th>
                                    <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e5e7eb;">Price</th>
                                    <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e5e7eb;">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHtml}
                            </tbody>
                        </table>

                        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <table style="width: 100%;">
                                <tr>
                                    <td style="padding: 5px 0;"><strong>Subtotal:</strong></td>
                                    <td style="padding: 5px 0; text-align: right;"><strong>₹${order.subtotal.toFixed(2)}</strong></td>
                                </tr>
                                ${order.couponDiscount > 0 ? `
                                <tr>
                                    <td style="padding: 5px 0;">Coupon Discount (${order.couponCode}):</td>
                                    <td style="padding: 5px 0; text-align: right; color: #059669;">-₹${order.couponDiscount.toFixed(2)}</td>
                                </tr>
                                ` : ''}
                                <tr>
                                    <td style="padding: 5px 0;">Shipping:</td>
                                    <td style="padding: 5px 0; text-align: right;">₹${order.shippingCost.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px 0;">Tax:</td>
                                    <td style="padding: 5px 0; text-align: right;">₹${order.tax.toFixed(2)}</td>
                                </tr>
                                <tr style="border-top: 2px solid #e5e7eb; margin-top: 10px;">
                                    <td style="padding: 10px 0 0 0;"><strong style="font-size: 18px;">Total:</strong></td>
                                    <td style="padding: 10px 0 0 0; text-align: right;"><strong style="font-size: 18px; color: #FF8C00;">₹${order.total.toFixed(2)}</strong></td>
                                </tr>
                            </table>
                        </div>

                        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #374151; margin-top: 0;">Shipping Address</h3>
                            <p style="margin: 5px 0;">${order.shippingAddress.name}</p>
                            <p style="margin: 5px 0;">${order.shippingAddress.street}</p>
                            <p style="margin: 5px 0;">${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}</p>
                            <p style="margin: 5px 0;">Phone: ${order.shippingAddress.phone}</p>
                        </div>

                        <p style="margin-top: 30px;">We will send you another email once your order has been shipped.</p>
                        <p>If you have any questions, please contact us at ${storeEmail} or ${storeSettings.storePhone || ''}.</p>
                        
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                        <p style="color: #6b7280; font-size: 12px; text-align: center;">
                            © ${new Date().getFullYear()} ${storeName} - Your Trusted Puja Store<br>
                            ${storeSettings.storeAddress || ''}
                        </p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Order confirmation email sent to ${customerEmail} for order #${order._id}`);
        return true;
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        return false;
    }
};

// Get user orders
router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product', 'name images price')
            .sort('-createdAt');
        res.json({ orders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
            .populate('items.product', 'name images price');

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create order from cart or items
router.post('/', async (req, res) => {
    try {
        const { shippingAddress, paymentMethod, notes, items, couponCode, couponDiscount } = req.body;
        
        // Try to get user from token (optional for guest checkout)
        let userId = null;
        let userEmail = null;
        let userName = null;
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            if (token) {
                const jwt = require('jsonwebtoken');
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const User = require('../models/User');
                const user = await User.findById(decoded.userId);
                if (user) {
                    userId = user._id;
                    userEmail = user.email;
                    userName = user.name;
                }
            }
        } catch (err) {
            // Guest checkout - no user
        }

        let orderItems = [];
        let subtotal = 0;

        // If items are provided directly (from localStorage cart)
        if (items && Array.isArray(items) && items.length > 0) {
            // Validate and process items
            for (const item of items) {
                const productId = item.productId || item.product?.id || item.product?._id;
                if (!productId) {
                    return res.status(400).json({ error: 'Product ID is required for all items' });
                }
                
                const mongoose = require('mongoose');
                let product;
                
                // Try to find product by ID (handles both string and ObjectId)
                if (mongoose.Types.ObjectId.isValid(productId)) {
                    product = await Product.findById(productId);
                } else {
                    return res.status(400).json({ error: `Invalid product ID: ${productId}` });
                }
                
                if (!product) {
                    return res.status(400).json({ error: `Product not found: ${productId}` });
                }
                if (!product.isActive) {
                    return res.status(400).json({ error: `Product ${product.name} is not available` });
                }
                if (product.stock < item.quantity) {
                    return res.status(400).json({ error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` });
                }
                
                const itemTotal = product.price * item.quantity;
                subtotal += itemTotal;
                orderItems.push({
                    product: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: item.quantity
                });
            }
        } else if (userId) {
            // Get user's cart from database
            const cart = await Cart.findOne({ user: userId }).populate('items.product');
            
            if (!cart || cart.items.length === 0) {
                return res.status(400).json({ error: 'Cart is empty' });
            }

            orderItems = cart.items.map(item => {
                const itemTotal = item.product.price * item.quantity;
                subtotal += itemTotal;
                return {
                    product: item.product._id,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity
                };
            });

            // Clear cart after order
            await Cart.findByIdAndDelete(cart._id);
        } else {
            return res.status(400).json({ error: 'No items provided and no cart found' });
        }

        if (orderItems.length === 0) {
            return res.status(400).json({ error: 'No items to order' });
        }

        // Get settings for shipping and tax
        const Settings = require('../models/Settings');
        const storeSettings = await Settings.getSettings();
        const freeShippingThreshold = storeSettings.freeShippingThreshold || 500;
        
        // Apply coupon discount if provided
        const appliedDiscount = couponDiscount || 0;
        const subtotalAfterDiscount = Math.max(0, subtotal - appliedDiscount);
        
        const shippingCost = subtotalAfterDiscount > freeShippingThreshold ? 0 : (storeSettings.shippingCost || 50);
        const taxRate = storeSettings.taxRate || 18;
        const tax = Math.round(subtotalAfterDiscount * (taxRate / 100));
        const total = subtotalAfterDiscount + shippingCost + tax;

        // Get customer email (from shipping address or user account)
        const customerEmail = shippingAddress?.email || userEmail;
        const customerName = shippingAddress?.name || userName;

        // Create order (user can be null for guest checkout)
        const order = new Order({
            user: userId,
            items: orderItems,
            shippingAddress: {
                name: shippingAddress?.name || shippingAddress?.street,
                street: shippingAddress?.address || shippingAddress?.street,
                city: shippingAddress?.city,
                state: shippingAddress?.state,
                zipCode: shippingAddress?.pincode || shippingAddress?.zipCode,
                phone: shippingAddress?.phone,
                email: customerEmail
            },
            paymentMethod: paymentMethod || 'cod',
            subtotal,
            shippingCost,
            tax,
            total,
            couponCode: couponCode || null,
            couponDiscount: appliedDiscount,
            notes,
            orderStatus: 'confirmed',
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending'
        });

        await order.save();

        // Update coupon usage count if coupon was applied
        if (couponCode) {
            const Coupon = require('../models/Coupon');
            await Coupon.findOneAndUpdate(
                { code: couponCode.toUpperCase() },
                { $inc: { used_count: 1 } }
            );
        }

        // Update product stock
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity }
            });
        }

        // Send order confirmation email to customer
        if (customerEmail) {
            try {
                await sendOrderConfirmationEmail(order, customerEmail, customerName);
            } catch (emailError) {
                // Don't fail the order if email fails, just log it
                console.error('Failed to send order confirmation email:', emailError);
            }
        }

        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Cancel order
router.put('/:id/cancel', auth, async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (!['pending', 'confirmed'].includes(order.orderStatus)) {
            return res.status(400).json({ error: 'Cannot cancel this order' });
        }

        order.orderStatus = 'cancelled';
        await order.save();

        // Restore product stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity }
            });
        }

        res.json({ message: 'Order cancelled', order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: Get all orders
router.get('/admin/all', adminAuth, async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        const query = {};
        if (status) query.orderStatus = status;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const orders = await Order.find(query)
            .populate('user', 'name email')
            .populate('items.product', 'name images')
            .sort('-createdAt')
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Order.countDocuments(query);

        res.json({
            orders,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: Update order status
router.put('/admin/:id/status', adminAuth, async (req, res) => {
    try {
        const { orderStatus, paymentStatus } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus, paymentStatus },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ message: 'Order status updated', order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
