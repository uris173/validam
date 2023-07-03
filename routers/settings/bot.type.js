const router = require('express').Router()
const {top} = require('../../middleware/auth')
const {
  all_types,
  create_bot_type,
  change_type_status
} = require('../../controllers/settings/bot.type')

router.get('/', all_types)
router.post('/', create_bot_type)
router.get('/status/:id', change_type_status)


module.exports = router