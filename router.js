const router = require('express').Router()

router.use('/helper', require('./routers/helpers'))

router.use('/auth', require('./routers/auth'))
router.use('/admin', require('./routers/admin'))
router.use('/category', require('./routers/category'))
router.use('/food', require('./routers/food'))
router.use('/user', require('./routers/users'))

// settings
router.use('/bottype', require('./routers/settings/bot.type'))

module.exports = router