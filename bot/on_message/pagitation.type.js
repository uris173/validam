const Category = require('../../models/category')
const { translation_assistant } = require('../options/helpers')
const {
  bot, 
  sliceIntoChunks
} = require('../bot')

const pagination_type_category = async (user_data, chatId) => {
  let array = []
  let category = await Category.find({status: true})
  category.forEach(val => {
    let obj = {}
    obj.text = user_data.language === 'ru' ? val.title : val.title_uz
    obj.callback_data = JSON.stringify({category: val._id})
    array.push(obj)
  })
  let res = translation_assistant(user_data.language)
  let sliced_val = sliceIntoChunks(array, 2)
  sliced_val.push([{text: res.translate.back, callback_data: 'back to menu'}])
  bot.sendMessage(chatId, res.translate.choose_category, {
    reply_markup: {
      inline_keyboard: sliced_val
    }
  })
}


module.exports = {
  pagination_type_category
}