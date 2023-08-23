const {Schema, model} = require('mongoose')


const admin = new Schema({
  name: String,
  login: String,
  password: String,
  role: String
})

module.exports = model('Admin', admin)