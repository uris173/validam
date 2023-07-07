const {Schema, model} = require('mongoose')

const review = new Schema({
  text: String,
  grade: Number,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: Number,
    default: 0
    // 0 - leaves a review
    // 1 - feedback left
  }
})

module.exports = model('Review', review)