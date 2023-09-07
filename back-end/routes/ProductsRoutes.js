const router = require('express').Router()

const ProductsController = require('../controllers/ProductsController')

router.get('/', ProductsController.getAll)
router.get('/:id', ProductsController.getById)
router.patch('/updatePrice', ProductsController.updatePrice)

module.exports = router