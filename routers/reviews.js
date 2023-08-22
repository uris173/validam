const router = require('express').Router()
const {all} = require('../middleware/auth')
const {
  all_reviews,
  get_review
} = require('../controllers/reviews')

router.get('/', all, all_reviews)
router.get('/:id', all, get_review)



module.exports = router