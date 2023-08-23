const router = require('express').Router()
const { top } = require('../../middleware/auth')
const {
  all_types,
  create_bot_type,
  change_type_status,
  delete_bot_type
} = require('../../controllers/settings/bot.type')

router.get('/', top, all_types)
router.post('/', top, create_bot_type)
router.get('/status/:id', top, change_type_status)
router.get('/:id', top, delete_bot_type)


module.exports = router