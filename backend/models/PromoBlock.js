const mongoose = require('mongoose');

const promoBlockSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    image_url: {
        type: String,
        required: true
    },
    button_text: {
        type: String,
        default: 'Call Now'
    },
    link_url: {
        type: String,
        default: '#'
    },
    display_order: {
        type: Number,
        default: 0
    },
    is_active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PromoBlock', promoBlockSchema);
