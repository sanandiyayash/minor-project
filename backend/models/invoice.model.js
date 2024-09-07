const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: [true, "Item name is required"]
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
    },
    unit: {
        type: String,
        required: [true, "Unit is required"],
    },
    rate: {
        type: Number,
        required: [true, "Rate is required"],
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
    }
});

const invoiceSchema = new mongoose.Schema({
    billNo: {
        type: String,
        required: [true, "Bill number is required"],
    },
    billDate: {
        type: Date,
        default: Date.now
    },
    customerName: {
        type: String,

        required: [true, "Customer name is required"]
    },
    billDueDate: {
        type: Date,
        required: true
    },
    items: [itemSchema],
    cgst: {
        type: Number,
        required: [true, "CGST is required"],
    },
    sgst: {
        type: Number,
        required: [true, "SGST is required"],
    },
    total: {
        type: Number,
        required: [true, "Total is required"],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

});
invoiceSchema.index({ billNo: 1, user: 1 }, { unique: true });

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
