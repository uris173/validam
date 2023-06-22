const router = require('express').Router()
const {all} = require('../middleware/auth')
const {
  all_category,
  create_category,
  get_category,
  edit_category,
  change_status,
  delete_category
} = require('../controllers/category')


router.get('/', all, all_category)
router.post('/', all, create_category)
router.get('/:id', all, get_category)
router.put('/', all, edit_category)
router.get('/status/:id/:status', all, change_status)
router.delete('/:id', all, delete_category)


module.exports = router