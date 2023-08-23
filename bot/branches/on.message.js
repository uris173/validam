const User = require('../../models/users')
const { bot, commands, groupId } = require('../bot')
const Bot_Type = require('../../models/bot.type')
const {
  start,
  user_language,
  contacts,
  leave_feedback,
  review,
  settings,
  cart,
  main_menu,
  get_contact
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
const { translation_assistant } = require('../options/helpers')


bot.on('message',async msg => {
  const chatId = msg.chat.id
  const find_user = await User.findOne({userId: chatId})

  if (msg.text === '/start' && chatId !== -1001921927445)
    start(msg, chatId)

  if (find_user && chatId !== -1001921927445) {
    let res = translation_assistant(find_user.language)
    const product_slice = msg.text?.split('-') || ''

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
    if (msg.text === 'Корзина 🧺' || msg.text === 'Savat 🧺')
      cart(find_user, chatId)
    if (msg.text === 'Настройки ⚙️' || msg.text === "Sozlamalar ⚙️")
      settings(chatId)

    if (find_user.action === 'request contact' && msg.contact || 
    find_user.action === 'request contact' && msg.text?.slice(0, 3) === '998' || 
    find_user.action === 'request contact' && msg.text?.slice(0, 4) === '+998') 
      get_contact(msg, find_user, chatId)

    // card type
    if (product_slice[0] === 'product')
      card_product(msg, find_user, chatId, product_slice[1])

    // simple type
    if (msg.text === res.translate.back && find_user.action === 'choose product')
      simple_type_category(find_user, chatId)
    if (msg.text === res.translate.back && find_user.action === 'choose category')
      main_menu(find_user, chatId)
    if (find_user.action === 'choose category' && msg.text !== res.translate.back)
      simple_category_products(msg, find_user, chatId)
    if (find_user.action === 'choose product' && msg.text !== res.translate.back)
      simple_product(msg, find_user, chatId)
  }
})