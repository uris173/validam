const User = require('../../models/users')
const { ru, uz } = require('../options/transates')
const { bot } = require('../bot')
const {
  start,
  user_language
} = require('../on_message/main')


bot.on('message',async msg => {
  const chatId = msg.chat.id
  const find_user = await User.findOne({userId: chatId})

  if (msg.text === '/start')
    start(msg, chatId)

  if (find_user) {
    
    if (msg.text === 'Русский 🇷🇺' || msg.text === "O'zbek 🇺🇿") 
      user_language(find_user, chatId, msg.text)

    
  }
})