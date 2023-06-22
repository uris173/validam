const router = require('express').Router()
const {
  top,
} = require('../middleware/auth')
const {
  all_admins,
  create_admin,
  get_admin,
  edit_admin,
  delete_admin
} = require('../controllers/admin')


router.get('/', top, all_admins)
router.post('/', top, create_admin)
router.get('/:id', top, get_admin)
router.put('/', top, edit_admin)
router.delete('/:id', top, delete_admin)


module.exports = router