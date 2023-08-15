const router = require('express').Router()
const {top} = require('../middleware/auth')
const {
  datas_count,
  doughnut_statistic,
  month_statistic,
  year_statistic
} = require('../controllers/statistic')

router.get('/top', top, datas_count)
router.get('/doughnut', top, doughnut_statistic)
router.get('/month', top, month_statistic)
router.get('/year', top, year_statistic)


module.exports = router