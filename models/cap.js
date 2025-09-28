const mongoose = require('mongoose');

const capSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    size: {
        type: String,
        enum: ['S', 'M', 'L', 'XL', 'Ajustable'],
        default: 'Ajustable'
    },
    material: {
        type: String,
        trim: true,
        default: 'Algodón'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Cap', capSchema);