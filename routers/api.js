const router = require('express').Router()
const {
  category_food
} = require('../controllers/api')

router.get('/category/:id', category_food)


module.exports = router