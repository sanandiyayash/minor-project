const express = require('express')
const router = express.Router()
const { addItems, getAllItems, deleteItems, editItemDetail, updataEditItem } = require('../controllers/itemController')
const { isLoggedIn } = require('../middlewares/isLoggedIn')

router.post('/add-new-item', isLoggedIn, addItems)
router.get('/allItems', isLoggedIn, getAllItems)
router.get('/:itemId/edit', isLoggedIn, editItemDetail)
router.put('/:itemId/edit', isLoggedIn, updataEditItem)
router.get('/:itemId/deleteItem', isLoggedIn, deleteItems)
module.exports = router