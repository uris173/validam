const router = require('express').Router()
const {all} = require('../middleware/auth')
const  {
  all_orders,
  get_order,
  send_message,
  edit_order,
  delete_order
} = require('../controllers/order')


router.get('/', all, all_orders)
router.get('/:id', all, get_order)
router.post('/message', all, send_message)
router.put('/', all, edit_order)
router.delete('/:id', all, delete_order)


module.exports = router