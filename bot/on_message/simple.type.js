const Category = require('../../models/category')
const Food = require('../../models/food')
const User = require('../../models/users')
const { 
  translation_assistant,
  card
} = require('../options/helpers')
const {
  bot, 
  sliceIntoChunks
} = require('../bot')

const simple_type_category = async (user_data, chatId) => {
  let category = await Category.find({status: true})
  let res = translation_assistant(user_data.language)
  let array = []
  await User.findByIdAndUpdate(user_data._id, {action: 'choose category'})

  category.forEach(val => {
    let text = user_data.language === 'ru' ? val.title : val.title_uz
    array.push(text)
  })

  let sliced_val = sliceIntoChunks(array, 2)
  sliced_val.push([res.translate.back])
  bot.sendMessage(chatId, res.translate.choose_category, {
    reply_markup: {
      keyboard: sliced_val,
      resize_keyboard: true
    }
  })
}

const simple_category_products = async (msg, user_data, chatId) => {
  const text = msg.text
  const category = await Category.findOne({$or: [{title: text}, {title_uz: text}]})
  let product = await Food.find({category: category._id, status: true})
  .sort({_id: -1})
  let res = translation_assistant(user_data.language)
  let array = []
  await User.findByIdAndUpdate(user_data._id, {action: 'choose product'})

  product.forEach(val => {
    let products = user_data.language === 'ru' ? val.title : val.title_uz
    array.push(products)
  })

  let sliced_val = sliceIntoChunks(array, 2)
  sliced_val.push([res.translate.back])
  bot.sendMessage(chatId, res.translate.choose_product, {
    reply_markup: {
      keyboard: sliced_val,
      resize_keyboard: true,
    }
  })
}

const simple_product = async (msg, user_data, chatId) => {
  const text = msg.text
  const product = await Food.findOne({$or: [{title: text}, {title_uz: text}]})
  let product_card = card(product, user_data.language)

  let res = translation_assistant(user_data.language)

  let count = 1
  bot.sendMessage(chatId, `Товар - ${product.title}`, {
    reply_markup: {
      remove_keyboard: true,
      one_time_keyboard: true
    }
  })
  bot.sendPhoto(chatId, product_card.img, {
    parse_mode: 'HTML',
    caption: product_card.info,
    reply_markup: {
      inline_keyboard: [
        [
          {text: '➖', callback_data: JSON.stringify({decrease: product._id, count})}, // decrease
          {text: count, callback_data: ' '},
          {text: '➕', callback_data: JSON.stringify({increase: product._id, count})} // increase
        ],
        [
          {text: res.translate.back, callback_data: JSON.stringify({simple: product.category})},
          {text: res.translate.to_cart, callback_data: JSON.stringify({to_cart: product._id, count})}
        ],
        [{text: res.translate.go_to_cart, callback_data: 'go to cart'}]
      ]
    }
  })
}

module.exports = {
  simple_type_category,
  simple_category_products,
  simple_product
}