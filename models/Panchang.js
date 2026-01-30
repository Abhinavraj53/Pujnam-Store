const mongoose = require('mongoose');

const panchangSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
        unique: true
    },
    tithi: {
        type: String,
        required: true
    },
    nakshatra: {
        type: String,
        required: true
    },
    yoga: {
        type: String
    },
    karana: {
        type: String
    },
    paksha: {
        type: String
    },
    vaar: {
        type: String
    },
    location: {
        type: String,
        default: 'Dadri'
    },
    sunrise: {
        type: String,
        required: true
    },
    sunset: {
        type: String,
        required: true
    },
    moonrise: {
        type: String
    },
    moonset: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Panchang', panchangSchema);
