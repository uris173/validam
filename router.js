const router = require('express').Router()

router.use('/helper', require('./routers/helpers'))

router.use('/auth', require('./routers/auth'))
router.use('/admin', require('./routers/admin'))
router.use('/category', require('./routers/category'))
router.use('/food', require('./routers/food'))
router.use('/user', require('./routers/users'))
router.use('/reviews', require('./routers/reviews'))
router.use('/order', require('./routers/order'))
router.use('/statistic', require('./routers/statistic'))
router.get('/salary', require('./routers/salary'))

// settings
router.use('/bottype', require('./routers/settings/bot.type'))

// api
router.use('/api', require('./routers/api'))

module.exports = router