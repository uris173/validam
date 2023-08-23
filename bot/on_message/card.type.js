const Category = require('../../models/category')
const Food = require('../../models/food')
const { 
  translation_assistant,
  card
} = require('../options/helpers')
const {
  bot, 
  sliceIntoChunks
} = require('../bot')

const card_type_category = async (user_data, chatId) => {
  let category = await Category.find({status: true})
  let res = translation_assistant(user_data.language)

  let array = []
  category.forEach(val => {
    let obj = {}
    obj.text = user_data.language === 'ru' ? val.title : val.title_uz
    obj.switch_inline_query_current_chat = obj.text
    array.push(obj)
  })
  
  let sliced_val = sliceIntoChunks(array, 2)
  sliced_val.push([{text: res.translate.back, callback_data: 'back to menu'}])
  bot.sendMessage(chatId, res.translate.choose_category, {
    reply_markup: {
      inline_keyboard: sliced_val
    }
  })
}

const card_product = async (msg, user_data, chatId, id) => {
  let product = await Food.findById(id)
  let product_card = card(product, user_data.language)

  let res = translation_assistant(user_data.language)
  bot.deleteMessage(chatId, msg.message_id - 1)
  bot.deleteMessage(chatId, msg.message_id)

  let count = 1
  bot.sendPhoto(chatId, product_card.img, {
    parse_mode: 'HTML',
    caption: product_card.info,
    reply_markup: {
      inline_keyboard: [
        [
          {text: '➖', callback_data: JSON.stringify({decrease: product._id, count: count})}, // decrease
          {text: count, callback_data: ' '},
          {text: '➕', callback_data: JSON.stringify({increase: product._id, count: count})} // increase
        ],
        [
          {text: res.translate.back, callback_data: 'card category'},
          {text: res.translate.to_cart, callback_data: JSON.stringify({to_cart: product._id, count})}
        ],
        [{text: res.translate.go_to_cart, callback_data: 'go to cart'}]
      ]
    }
  })
}


module.exports = {
  card_type_category,
  card_product
}