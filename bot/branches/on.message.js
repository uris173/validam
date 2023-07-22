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

// pagination type
const {
  pagination_type_category
} = require('../on_message/pagitation.type')
// card type
const {
  card_type_category,
  card_product
} = require('../on_message/card.type')
// simple type
const { 
  simple_type_category,
  simple_category_products,
  simple_product
} = require('../on_message/simple.type')


bot.on('message',async msg => {
  const chatId = msg.chat.id
  const find_user = await User.findOne({userId: chatId})

  if (msg.text === '/start')
    start(msg, chatId)

  if (find_user) {
    const product_slice = msg.text.split('-')

    if (msg.text === 'Меню 📋' || msg.text === "Menyu 📋") {
      let type = await Bot_Type.findOne({status: true})

      if (type.title === 'Пагинация')
        pagination_type_category(find_user, chatId)
      if (type.title === 'Обычная')
        simple_type_category(find_user, chatId)
      if (type.title === 'Карточка товара')
        card_type_category(find_user, chatId)
    }
    
    // main js
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

    // card type
    if (product_slice[0] === 'product')
      card_product(msg, find_user, chatId, product_slice[1])

    // simple type
    if (find_user.action === 'choose category')
      simple_category_products(msg, find_user, chatId)
    if (find_user.action === 'choose product')
      simple_product(msg, find_user, chatId)
  }
})