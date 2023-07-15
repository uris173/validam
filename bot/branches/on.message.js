const User = require('../../models/users')
const { bot, commands } = require('../bot')
const Bot_Type = require('../../models/bot.type')
const {
  start,
  user_language,
  contacts,
  leave_feedback,
  review,
  settings
} = require('../on_message/main')

const {
  pagination_type_category
} = require('../on_message/pagitation.type')


bot.on('message',async msg => {
  const chatId = msg.chat.id
  const find_user = await User.findOne({userId: chatId})

  if (msg.text === '/start')
    start(msg, chatId)

  if (find_user) {
    if (msg.text === 'Меню 📋' || msg.text === "Menyu 📋") {
      let type = await Bot_Type.findOne({status: true})

      if (type.title === 'Пагинация')
        pagination_type_category(find_user, chatId)
      if (type.title === 'Обычная')
        console.log('simple');
      if (type.title === 'Карточка товара')
        console.log('card');
    }
    
    if (msg.text === 'Русский 🇷🇺' || msg.text === "O'zbek 🇺🇿") 
      user_language(find_user, chatId, msg.text)
    if (msg.text === 'Контакты 📞' || msg.text === "Kontaktlar 📞")
      contacts(find_user, chatId)
    if (msg.text === 'Оставить отзыв ✍️' || msg.text === "Fikr qoldiring ✍️")
      leave_feedback(find_user, chatId)
    if (find_user.action === 'review') 
      review(find_user, msg.text, commands, chatId)
    if (msg.text === 'Настройки ⚙️' || msg.text === "Sozlamalar ⚙️")
      settings(chatId)
  }
})