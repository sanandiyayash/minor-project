const express = require('express')
const router = express.Router()
const { register, login, logout } = require('../controllers/userController')
const { createInvoice } = require('../controllers/invoiceControler')
const { isLoggedIn } = require('../middlewares/isLoggedIn')

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/p', isLoggedIn, createInvoice)
module.exports = router