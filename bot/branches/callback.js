const User = require('../../models/users')
const { bot } = require('../bot')
const {
  to_main_menu,
  callback_grade,
  decrease,
  increase,
  add_to_cart,
} = require('../callbacks/main')
const {
  cart_items,
  clear_cart,
  change_cart_item,
  change_count_action,
  change_product_count,
  calculate_count,
  save_count,
  action_delete_item,
  delete_item
} = require('../callbacks/cart')

// pagination
const {
  pagintation_callback_category,
  callback_next,
  pagination_callback_product,
  back_to_pagination,
} = require('../callbacks/pagitation.type')
const { 
  pagination_type_category,
} = require('../on_message/pagitation.type')

// card type
const { 
  card_type_category
} = require('../on_message/card.type')

// simple type
const { 
  simple_category_products
} = require('../callbacks/simple.type')



bot.on('callback_query', async query => {
  const chatId = query.from.id
  const data = query.data
  const find_user = await User.findOne({userId: chatId})
  if (find_user.action === 'grade')
    callback_grade(query, find_user, chatId)

  // main js
  if (data === 'back to menu')
    to_main_menu(query, find_user, chatId)
  if (data.slice(2, 10) === 'decrease') 
    decrease(query, find_user, chatId)
  if (data.slice(2, 10) === 'increase') 
    increase(query, find_user, chatId)
  if (data.slice(2, 6) === 'back')
    back_to_pagination(query, find_user, chatId)
  if (data.slice(2, 9) === 'to_cart')
    add_to_cart(query, find_user, chatId)
  if (data.slice(2, 6) === 'save')
    save_count(query, find_user, chatId)
  if (data === 'action remove item')
    action_delete_item(query, find_user, chatId)
  if (data.slice(2, 8) === 'delete')
    delete_item(query, find_user, chatId)

  // cart js
  if (data === 'go to cart') {
    bot.deleteMessage(chatId, query.message.message_id)
    cart_items(query, find_user, chatId)
  }
  if (data === 'clear')
    clear_cart(query, find_user, chatId)
  if (data === 'change items')
    change_cart_item(query, find_user, chatId)
  if (data === 'action change count')
    change_count_action(query, find_user, chatId)
  if (data.slice(2, 8) === 'change')
    change_product_count(query, find_user, chatId)
  if (data.slice(2, 4) === 'id')
    calculate_count(query, find_user, chatId)
  
  // pagination type
  if (data.slice(2, 10) === 'category')
    pagintation_callback_category(query, find_user, chatId)
  if (data.slice(2, 6) === 'next')
    callback_next(query, find_user, chatId)
  if (data.slice(2, 6) === 'prod')
    pagination_callback_product(query, find_user, chatId)
  if (data === 'pagination category') {
    bot.deleteMessage(chatId, query.message.message_id)
    pagination_type_category(find_user, chatId)
  }
  
  // card type
  if (data === 'card category') {
    bot.deleteMessage(chatId, query.message.message_id)
    card_type_category(find_user, chatId)
  }
  
  // simple type
  if (data.slice(2, 8) === 'simple') {
    bot.deleteMessage(chatId, query.message.message_id)
    simple_category_products(query, find_user, chatId)
  }
})