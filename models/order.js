const {Schema, model} = require('mongoose')

const order = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  products: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    count: Number,
  }],
  comment: String,
  status: {
    type: Number,
    default: 0
  }
})

module.exports = model('Order', order)