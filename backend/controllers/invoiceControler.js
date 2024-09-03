const Invoice = require('../models/invoice.model');
const User = require('../models/user');
const Item = require('../models/item.model')

const allInvoice = async (req, res) => {
    try {
        const invoices = await Invoice.find({ user: req.user._id }).populate('user', 'name email');
        res.status(200).json({ invoices });
    } catch (error) {
        console.error('Error fetching invoices:', error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const fetchAllitems = async (req, res) => {
    try {
        const currentUser = req.user;
        const items = await Item.find({ owner: currentUser })
        if (!items) res.status(400).json({ message: "item not found", success: false })
        return res.status(200).json({ message: 'item fetched successfully', items })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}
const createInvoice = async (req, res) => {
    try {
        const { billNo, billDate, customerName, billDueDate, items, cgst, sgst, total } = req.body;

        if (!billNo || !billDate || !customerName || !billDueDate || !items || !cgst || !sgst || !total) {
            return res.status(400).json({ message: "All fields are required", success: false, });
        }
        const newInvoice = await Invoice.create({
            billNo,
            billDate,
            customerName,
            billDueDate,
            items,
            cgst,
            sgst,
            total,
            user: req.user._id
        });

        await User.findByIdAndUpdate(req.user._id, {
            $push: { invoices: newInvoice._id }
        });

        res.status(201).json({
            success: true,
            message: 'Invoice created successfully',
            data: newInvoice,
            user: req.user,

        });
    } catch (error) {
        console.error('Error creating invoice:', error.message);
        if (error.code === 11000) {
            return res.status(400).json({
                message: " A bill with this number already exists.",
                field: "billNo"
            });
        }
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the invoice',
            error: error.message
        });
    }
};

const InvoiceDetails = async (req, res) => {

    try {
        const { invoiceId } = req.params;
        const invoice = await Invoice.findById(invoiceId).populate('user', 'name email');
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        res.status(201).json({ invoice });
    } catch (error) {
        console.error('Error fetching invoice details:', error.message);
        res.status(500).json({ error: error.message, message: 'Internal server error' });
    }
};

const deleteInvoice = async (req, res) => {
    try {
        const { invoiceId } = req.params;
        const invoice = await Invoice.findByIdAndDelete(invoiceId);
        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }
        await User.findByIdAndUpdate(invoice.user, {
            $pull: { invoices: invoiceId }
        });

        res.status(200).json({
            success: true,
            message: 'Invoice deleted successfully',
            deletedInvoice: invoice
        });
    } catch (error) {
        console.error('Error deleting invoice:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while deleting the invoice',
            error: error.message
        });
    }
};

module.exports = { allInvoice, createInvoice, InvoiceDetails, deleteInvoice, fetchAllitems };
