const router = require('express').Router()

const PacksController = require('../controllers/PacksController')

router.get('/', PacksController.getAll)
router.get('/:id', PacksController.getById)

module.exports = router