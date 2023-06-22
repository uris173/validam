const {Schema, model} = require('mongoose')

const cart = new Schema({
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
})

module.exports = model('Cart', cart)