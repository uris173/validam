const router = require('express').Router()
const {
  post_image
} = require('../helpers/upload')

router.post('/upload', post_image)


module.exports = router