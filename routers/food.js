const router = require('express').Router()
const {all} = require('../middleware/auth')
const {
  all_foods,
  create_category,
  get_food,
  change_food_status,
  edit_food,
  delete_food
} = require('../controllers/food')


router.get('/', all, all_foods)
router.post('/', all, create_category)
router.get('/:id', all, get_food)
router.get('/status/:id/:status', all, change_food_status)
router.put('/', all, edit_food)
router.delete('/:id', all, delete_food)


module.exports = router