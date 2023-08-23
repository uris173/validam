const {Schema, model} = require('mongoose')

const food = new Schema({
  title: String,
  title_uz: String,
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  weight_type: String,
  weight: Number,
  price: Number,
  image: [],
  description: String,
  description_uz: String,
  status: {
    type: Boolean,
    default: false
  }
})


module.exports = model('Food', food)