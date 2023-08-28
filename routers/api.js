const router = require('express').Router()
const {
  category_food,
  add_to_cart
} = require('../controllers/api')

router.get('/category/:id', category_food)
router.post('/add/cart', add_to_cart)


module.exports = router