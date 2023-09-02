const router = require('express').Router()
const {
  top
} = require('../middleware/auth')
const {
  all_users,
    sms_sending
} = require('../controllers/users')

router.get('/', top, all_users)
router.post('/sending', top, sms_sending)


module.exports = router