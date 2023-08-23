const {Schema, model} = require('mongoose')

const bot_type = new Schema({
  title: String,
  status: {
    type: Boolean,
    default: false
  }
})


module.exports = model('BotType', bot_type)