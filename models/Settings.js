const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    // Store Information
    storeName: {
        type: String,
        default: 'Pujnam Store'
    },
    storeEmail: {
        type: String,
        default: 'info@pujnamstore.com'
    },
    storePhone: {
        type: String,
        default: '+91 98765 43210'
    },
    storeAddress: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    state: {
        type: String,
        default: ''
    },
    pincode: {
        type: String,
        default: ''
    },
    logo: {
        type: String,
        default: 'https://images.pexels.com/photos/8989571/pexels-photo-8989571.jpeg'
    },
    tagline: {
        type: String,
        default: 'AAPKI AASTHA KA SAARTHI'
    },
    
    // Store Configuration
    currency: {
        type: String,
        default: 'INR'
    },
    taxRate: {
        type: Number,
        default: 18
    },
    freeShippingThreshold: {
        type: Number,
        default: 499
    },
    shippingCost: {
        type: Number,
        default: 50
    },
    lowStockThreshold: {
        type: Number,
        default: 10
    },
    enableReviews: {
        type: Boolean,
        default: true
    },
    enableNewsletter: {
        type: Boolean,
        default: true
    },
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    
    // Social Media
    facebookUrl: {
        type: String,
        default: ''
    },
    instagramUrl: {
        type: String,
        default: ''
    },
    twitterUrl: {
        type: String,
        default: ''
    },
    
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
