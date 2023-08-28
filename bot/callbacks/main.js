const { bot, url } = require('../bot')
const User = require('../../models/users')
const Review = require('../../models/review')
const Food = require('../../models/food')
const Storage = require('../../models/tg.storage')
const { translation_assistant } = require('../options/helpers')
const Bot_Type = require('../../models/bot.type')
const axios = require('axios')


const to_main_menu = async (query, user_data, chatId) => {
  let res = translation_assistant(user_data.language)
  bot.deleteMessage(chatId, query.message.message_id)
  bot.sendMessage(chatId, res.translate.choose_interests_you, {
    reply_markup: {
      keyboard: res.kb,
      resize_keyboard: true
    }
  })
}

const callback_grade = async (query, user_data, chatId) => {
  const messageId = query.message.message_id
  const callback = JSON.parse(query.data)
  await User.findByIdAndUpdate(user_data._id, {action: 'review'})
  const new_reviw = new Review({grade: callback.grade, user: user_data._id})
  await new_reviw.save()

  const title = user_data.language === 'ru' ? `Вы поставили ${callback.grade} 🌟` : `Siz ${callback.grade} 🌟 berdingiz`
  const text = user_data.language === 'ru' ? 'Теперь напиши свой отзыв.' : 'Endi sharhlaringizni yozing.'
  bot.editMessageText(`${title}\n<b><u>${text}</u></b>`, {
    chat_id: chatId,
    message_id: messageId,
    parse_mode: 'HTML'
  })
}

const decrease = async (query, user_data, chatId) => {
  let callback = JSON.parse(query.data)
  const product = await Food.findById(callback.decrease)
  let storage = await Storage.findOne({user: user_data._id})
  let res = translation_assistant(user_data.language)
  if (callback.count === 1 || storage?.count === 1) {
    bot.answerCallbackQuery(query.id, {text: res.translate.decrease_inline, show_alert: true})
  } else {
    bot.answerCallbackQuery(query.id).then(async () => {
      let bot_type = await Bot_Type.findOne({status: true})
      let back_type = bot_type.title === 'Пагинация' ? JSON.stringify({back: product.category, next: callback.next}) : bot_type.title === 'Карточка товара' ? 'card category' : bot_type.title === 'Обычная' ? JSON.stringify({simple: product.category}) : ' '

      callback.count = callback.count === 1 ? callback.count : callback.count -= 1
      await Storage.findByIdAndUpdate(storage._id, {product: product._id, count: callback.count})
      bot.editMessageReplyMarkup({
        inline_keyboard: [
          [
            {text: '➖', callback_data: JSON.stringify({decrease: product._id, count: callback.count, next: callback?.next})}, // decrease
            {text: callback.count, callback_data: ' '},
            {text: '➕', callback_data: JSON.stringify({increase: product._id, count: callback.count, next: callback?.next})} // increase
          ],
          [
            {text: res.translate.back, callback_data: back_type},
            {text: res.translate.to_cart, callback_data: JSON.stringify({to_cart: product._id, count: callback.count})}
          ],
          [{text: res.translate.go_to_cart, callback_data: 'go to cart'}]
        ]
      }, {chat_id: chatId, message_id: query.message.message_id})
    })
  }
}

const increase = async (query, user_data, chatId) => {
  bot.answerCallbackQuery(query.id).then(async () => {
    let callback = JSON.parse(query.data)
    callback.count += 1
    const product = await Food.findById(callback.increase)
    let storage = await Storage.findOne({user: user_data._id})
    
    let bot_type = await Bot_Type.findOne({status: true})
    let back_type = bot_type.title === 'Пагинация' ? JSON.stringify({back: product.category, next: callback.next}) : bot_type.title === 'Карточка товара' ? 'card category' : bot_type.title === 'Обычная' ? JSON.stringify({simple: product.category}) : ' '

    let res = translation_assistant(user_data.language)
    if (storage) {
      await Storage.findByIdAndUpdate(storage._id, {product: product._id, count: callback.count})
      bot.editMessageReplyMarkup({
        inline_keyboard: [
          [
            {text: '➖', callback_data: JSON.stringify({decrease: product._id, count: callback.count, next: callback?.next})}, // decrease
            {text: callback.count, callback_data: ' '},
            {text: '➕', callback_data: JSON.stringify({increase: product._id, count: callback.count, next: callback?.next})} // increase
          ],
          [
            {text: res.translate.back, callback_data: back_type},
            {text: res.translate.to_cart, callback_data: JSON.stringify({to_cart: product._id, count: callback.count})}
          ],
          [{text: res.translate.go_to_cart, callback_data: 'go to cart'}]
        ]
      }, {chat_id: chatId, message_id: query.message.message_id})
    } else {
      const new_storage = new Storage({user: user_data._id, product: product._id, count: callback.count})
      await new_storage.save()
      bot.editMessageReplyMarkup({
        inline_keyboard: [
          [
            {text: '➖', callback_data: JSON.stringify({decrease: product._id, count: callback.count, next: callback?.next})}, // decrease
            {text: callback.count, callback_data: ' '},
            {text: '➕', callback_data: JSON.stringify({increase: product._id, count: callback.count, next: callback?.next})} // increase
          ],
          [
            {text: res.translate.back, callback_data: back_type},
            {text: res.translate.to_cart, callback_data: JSON.stringify({to_cart: product._id, count: callback.count})}
          ],
          [{text: res.translate.go_to_cart, callback_data: 'go to cart'}]
        ]
      }, {chat_id: chatId, message_id: query.message.message_id})
    }
  })
}

const add_to_cart = async (query, user_data, chatId) => {
  const callback = JSON.parse(query.data)
  let response = await axios.post(`${url}/api/add/cart`, {
    _id: user_data._id,
    to_cart: callback.to_cart,
    count: callback.count
  })
  if (response.status === 201) {
    let res = translation_assistant(user_data.language)
    bot.answerCallbackQuery(query.id, {text: `${res.translate.added_product} ${response.data}`, show_alert: true})
    // await Storage.findOneAndUpdate({user: user_data._id}, {$set: {count: 1}})
  }
}


module.exports = {
  to_main_menu,
  callback_grade,
  decrease,
  increase,
  add_to_cart
}