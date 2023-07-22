const User = require('../../models/users')
const Category = require('../../models/category')
const { bot } = require('../bot')
const { 
  category_card_products 
} = require('../callbacks/card.type')

bot.on('inline_query', async query => {
  const chatId = query.from.id
  const find_user = await User.findOne({userId: chatId})

  const category = await Category.findOne({$or: [{title: query.query}, {title_uz: query.query}]})

  if (category) {
    category_card_products(query, find_user, category)
  }
})