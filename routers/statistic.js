const router = require('express').Router()
const {top} = require('../middleware/auth')
const {
  datas_count,
  doughnut_statistic,
  popular_products,
  month_statistic,
  year_statistic
} = require('../controllers/statistic')

router.get('/top', top, datas_count)
router.get('/doughnut', top, doughnut_statistic)
router.get('/popular-products', top, popular_products)
router.get('/month', top, month_statistic)
router.get('/year', top, year_statistic)


module.exports = router