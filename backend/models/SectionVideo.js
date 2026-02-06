const mongoose = require('mongoose');

const sectionVideoSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        default: ''
    },
    video_url: {
        type: String,
        required: true
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

module.exports = mongoose.model('SectionVideo', sectionVideoSchema);
