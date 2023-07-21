const { bot } = require('../bot')
const User = require('../../models/users')
const Review = require('../../models/review')
const Food = require('../../models/food')
const Storage = require('../../models/tg.storage')
const { translation_assistant } = require('../options/helpers')
const Bot_Type = require('../../models/bot.type')


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
  const food = await Food.findById(callback.decrease)
  let storage = await Storage.findOne({user: user_data._id, product: food._id})
  let res = translation_assistant(user_data.language)
  if (callback.count === 1 || storage?.count === 1) {
    bot.answerCallbackQuery(query.id, {text: res.translate.decrease_inline, show_alert: true})
  } else {
    bot.answerCallbackQuery(query.id).then(async () => {
      let bot_type = await Bot_Type.findOne({status: true})
      let back_type = bot_type.title === 'Пагинация' ? JSON.stringify({back: food.category, next: callback.next}) : ''

      callback.count = callback.count === 1 ? callback.count : callback.count -= 1
      await Storage.findByIdAndUpdate(storage._id, {count: callback.count})
      bot.editMessageReplyMarkup({
        inline_keyboard: [
          [
            {text: '➖', callback_data: JSON.stringify({decrease: food._id, count: callback.count, next: callback.next})}, // decrease
            {text: callback.count, callback_data: ' '},
            {text: '➕', callback_data: JSON.stringify({increase: food._id, count: callback.count, next: callback.next})} // increase
          ],
          [
            {text: res.translate.back, callback_data: back_type},
            {text: res.translate.to_cart, callback_data: JSON.stringify({to_cart: food._id, count: callback.count})}
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
    const food = await Food.findById(callback.increase)
    let storage = await Storage.findOne({user: user_data._id, product: food?._id})
    
    let bot_type = await Bot_Type.findOne({status: true})
    let back_type = bot_type.title === 'Пагинация' ? JSON.stringify({back: food.category, next: callback.next}) : ''
    let res = translation_assistant(user_data.language)

    if (storage) {
      await Storage.findByIdAndUpdate(storage._id, {count: callback.count})
      bot.editMessageReplyMarkup({
        inline_keyboard: [
          [
            {text: '➖', callback_data: JSON.stringify({decrease: food._id, count: callback.count, next: callback.next})}, // decrease
            {text: callback.count, callback_data: ' '},
            {text: '➕', callback_data: JSON.stringify({increase: food._id, count: callback.count, next: callback.next})} // increase
          ],
          [
            {text: res.translate.back, callback_data: back_type},
            {text: res.translate.to_cart, callback_data: JSON.stringify({to_cart: food._id, count: callback.count})}
          ],
          [{text: res.translate.go_to_cart, callback_data: 'go to cart'}]
        ]
      }, {chat_id: chatId, message_id: query.message.message_id})
    } else {
      const new_storage = new Storage({user: user_data._id, product: food._id, count: callback.count})
      await new_storage.save()
      bot.editMessageReplyMarkup({
        inline_keyboard: [
          [
            {text: '➖', callback_data: JSON.stringify({decrease: food._id, count: callback.count, next: callback.next})}, // decrease
            {text: callback.count, callback_data: ' '},
            {text: '➕', callback_data: JSON.stringify({increase: food._id, count: callback.count, next: callback.next})} // increase
          ],
          [
            {text: res.translate.back, callback_data: back_type},
            {text: res.translate.to_cart, callback_data: JSON.stringify({to_cart: food._id, count: callback.count})}
          ],
          [{text: res.translate.go_to_cart, callback_data: 'go to cart'}]
        ]
      }, {chat_id: chatId, message_id: query.message.message_id})
    }
  })
}


module.exports = {
  callback_grade,
  decrease,
  increase
}