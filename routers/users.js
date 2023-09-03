const router = require('express').Router()
const {
  top
} = require('../middleware/auth')
const {
  all_users,
} = require('../controllers/users')

router.get('/', top, all_users)


module.exports = router