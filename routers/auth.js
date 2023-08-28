const router = require('express').Router()
const {
  all
} = require('../middleware/auth')
const {
  admin,
  login,
  login_verification,
  check_admin
} = require('../controllers/auth')


router.get('/addadmin', admin)
router.post('/login', login)
router.post('/loginverif', login_verification)
router.get('/checkadmin', all, check_admin)


module.exports = router