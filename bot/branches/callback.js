const User = require('../../models/users')
const { bot } = require('../bot')
const { translation_assistant } = require('../options/helpers')
const {
  callback_grade
} = require('../callbacks/main')
const {
  pagintation_callback_category,
  callback_next
} = require('../callbacks/pagitation.type')


bot.on('callback_query', async query => {
  const chatId = query.from.id
  const data = query.data
  const find_user = await User.findOne({userId: chatId})
  // let res = translation_assistant(find_user.language)
  
  // if (data = res.translate.back)
  if (find_user.action === 'grade')
    callback_grade(query, find_user, chatId)
  
  if (data.slice(2, 10) === 'category')
    pagintation_callback_category(query, find_user, chatId)
  if (data.slice(2, 6) === 'next')
    callback_next(query, find_user, chatId)
})