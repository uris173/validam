const {Schema, model} = require('mongoose')


const category = new Schema({
  title: String,
  title_uz: String,
  slug: String,
  status: {
    type: Boolean,
    default: false
  }
})

module.exports = model('Category', category)