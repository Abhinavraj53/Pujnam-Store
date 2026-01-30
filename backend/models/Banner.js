const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String
    },
    image_url: {
        type: String,
        required: true
    },
    link_url: {
        type: String,
        default: '#/'
    },
    button_text: {
        type: String,
        default: 'Shop Now'
    },
    position: {
        type: String,
        enum: ['hero', 'banner', 'sidebar'],
        default: 'hero'
    },
    is_active: {
        type: Boolean,
        default: true
    },
    display_order: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Banner', bannerSchema);
