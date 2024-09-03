const express = require('express')
const router = express.Router()
const { allInvoice, createInvoice, InvoiceDetails, deleteInvoice, fetchAllitems } = require('../controllers/invoiceControler')
const { isLoggedIn } = require('../middlewares/isLoggedIn')



router.get('/', isLoggedIn, allInvoice)
router.post('/create', isLoggedIn, createInvoice)
// router.get('/', isLoggedIn, createInvoice)
router.get('/:invoiceId', isLoggedIn, InvoiceDetails)
router.delete('/:invoiceId', isLoggedIn, deleteInvoice)
module.exports = router