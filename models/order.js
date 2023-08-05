const {Schema, model} = require('mongoose')

const order = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  products: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Food'
    },
    count: Number,
  }],
  date: Date,
  order_num: Number,
  comment: String,
  status: {
    type: Number,
    default: 0
  }
})

module.exports = model('Order', order)