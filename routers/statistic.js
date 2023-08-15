const router = require('express').Router()
const {top} = require('../middleware/auth')
const {
  top_statistic,
  month_statistic,
  year_statistic
} = require('../controllers/statistic')


router.get('/top', top_statistic)
router.get('/month', month_statistic)
router.get('/year', year_statistic)


module.exports = router