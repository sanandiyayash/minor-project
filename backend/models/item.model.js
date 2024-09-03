const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        unique: true,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })
const Item = mongoose.model('Item', itemSchema);

module.exports = Item