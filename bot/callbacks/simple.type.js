const Food = require('../../models/food')
const User = require('../../models/users')
const { translation_assistant, card } = require('../options/helpers')
const {
  bot,
  sliceIntoChunks
} = require('../bot')

const simple_category_products = async (query, user_data, chatId) => {
  const callback = JSON.parse(query.data)
  const product = await Food.find({category: callback.simple, status: true})
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


module.exports = {
  simple_category_products
}