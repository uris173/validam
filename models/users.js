const {Schema, model} = require('mongoose')


const user = new Schema({
  userId: Number,
  name: String,
  username: String,
  phone: String,
  language: String,
  action: {
    type: String,
    default: ''
  }
})

module.exports = model('User', user)