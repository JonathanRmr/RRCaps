const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    logo: {
        type: String,
        trim: true
    },
    league: {
        type: String,
        enum: ['MLB', 'NFL', 'NBA', 'NHL', 'Otros'],
        default: 'MLB'
    },
    foundedYear: {
        type: Number,
        min: 1800,
        max: new Date().getFullYear()
    },
    city: {
        type: String,
        trim: true
    },
    colors: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);