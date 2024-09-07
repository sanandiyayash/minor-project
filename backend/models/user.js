const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true
    },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }
    ],
    invoices: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Invoice'
        }
    ],

}, { timestamps: true });
const User = mongoose.model('User', userSchema);

module.exports = User