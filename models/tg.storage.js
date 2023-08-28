const {Schema, model} = require('mongoose')

const storage = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  count: Number,
})

module.exports = model('Storage', storage)