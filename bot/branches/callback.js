const User = require('../../models/users')
const { bot } = require('../bot')
const { translation_assistant } = require('../options/helpers')
const {
  callback_grade,
  decrease,
  increase
} = require('../callbacks/main')
const {
  pagintation_callback_category,
  callback_next,
  pagination_callback_food,
  back_to_pagination
} = require('../callbacks/pagitation.type')


bot.on('callback_query', async query => {
  const chatId = query.from.id
  const data = query.data
  const find_user = await User.findOne({userId: chatId})
  
  if (find_user.action === 'grade')
    callback_grade(query, find_user, chatId)
  
  if (data.slice(2, 10) === 'category')
    pagintation_callback_category(query, find_user, chatId)
  if (data.slice(2, 6) === 'next')
    callback_next(query, find_user, chatId)
  if(data.slice(2, 6) === 'food')
    pagination_callback_food(query, find_user, chatId)
  if(data.slice(2, 10) === 'decrease') 
    decrease(query, find_user, chatId)
  if(data.slice(2, 10) === 'increase') 
    increase(query, find_user, chatId)
  if(data.slice(2, 6) === 'back')
    back_to_pagination(query, find_user, chatId)
})