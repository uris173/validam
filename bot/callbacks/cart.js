const Cart = require('../../models/cart')
const Order = require('../../models/order')
const User = require('../../models/users')
const { io } = require('../../index')
const {
  cart_products, translation_assistant, actions_products, product_count_info, get_random_int
} = require('../options/helpers')
const {
  bot,
  sliceIntoChunks,
  groupId
} = require('../bot')

const cart_items = async (query, user_data, chatId) => {
  bot.answerCallbackQuery(query.id).then(async () => {
    await User.findByIdAndUpdate(user_data._id, {action: ''})
    let cart = await Cart.findOne({user: user_data._id})
    .populate({path: 'products.product', select: 'title title_uz price'}).lean()
    let res = translation_assistant(user_data.language)

    if (cart.products.length > 0) {
      let products = cart_products(cart.products, user_data.language)
      bot.sendMessage(chatId, products, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{text: res.translate.clear, callback_data: 'clear'}],
            [{text: res.translate.change, callback_data: 'change items'}],
            [{text: res.translate.order, callback_data: 'order'}],
            [{text: res.translate.back, callback_data: 'back to menu'}],
          ]
        }
      })
    } else {
      bot.sendMessage(chatId, res.translate.empty_cart, {
        reply_markup: {
          keyboard: res.kb
        }
      })
    }
  })
}

const clear_cart = async (query, user_data, chatId) => {
  const find_cart = await Cart.findOne({user: user_data._id})
  await Cart.findByIdAndUpdate(find_cart._id, {products: []})
  const res = translation_assistant(user_data.language)
  bot.deleteMessage(chatId, query.message.message_id)
  bot.sendMessage(chatId, res.translate.clear_success, {
    reply_markup: {
      keyboard: res.kb,
      resize_keyboard: true
    }
  })
}

const change_cart_item = async (query, user_data, chatId) => {
  bot.answerCallbackQuery(query.id).then(async () => {
    let res = translation_assistant(user_data.language)

    bot.editMessageText(res.translate.change_actions, {
      chat_id: chatId,
      message_id: query.message.message_id,
      reply_markup: {
        inline_keyboard: [
          [{text: res.translate.action_change_count, callback_data: 'action change count'}],
          [{text: res.translate.action_remove_item, callback_data: 'action remove item'}],
          [{text: res.translate.back, callback_data: 'go to cart'}],
        ]
      }
    })
  })
}

const change_count_action = async (query, user_data, chatId) => {
  bot.answerCallbackQuery(query.id).then(async () => {
    let cart = await Cart.findOne({user: user_data._id})
    .populate({path: 'products.product', select: 'title title_uz price'}).lean()
    let products = actions_products(cart.products, user_data.language, 'change count')
    let res = translation_assistant(user_data.language)

    let sliced_val = sliceIntoChunks(products.array, 1)
    sliced_val.push([{text: res.translate.back, callback_data: 'change items'}])

    bot.editMessageText(`${res.translate.change_count}\n\n${products.list}`, {
      chat_id: chatId,
      message_id: query.message.message_id,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: sliced_val
      }
    })
  })
}

const change_product_count = async (query, user_data, chatId) => {
  bot.answerCallbackQuery(query.id).then(async () => {
    const callback = JSON.parse(query.data)
    let cart = await Cart.findOne({user: user_data._id})
    .populate({path: 'products.product', select: 'title title_uz price'}).lean()
    let res = translation_assistant(user_data.language)

    let find_cart_item = cart.products.find(val => val._id.toString() === callback.change)
    let text = product_count_info(find_cart_item, user_data.language)
    bot.editMessageText(text, {
      chat_id: chatId,
      message_id: query.message.message_id,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            {text: '➖', callback_data: JSON.stringify({id: find_cart_item._id, count: find_cart_item.count - 1})},
            {text: find_cart_item.count, callback_data: ' '},
            {text: '➕', callback_data: JSON.stringify({id: find_cart_item._id, count: find_cart_item.count + 1})}
          ],
          [{text: res.translate.save, callback_data: JSON.stringify({save: find_cart_item._id, count: find_cart_item.count})}],
          [{text: res.translate.back, callback_data: 'action change count'}],
        ]
      }
    })
  })
}

const calculate_count = async (query, user_data, chatId) => {
  bot.answerCallbackQuery(query.id).then(async () => {
    const callback = JSON.parse(query.data)
    let res = translation_assistant(user_data.language)
    bot.editMessageReplyMarkup({
      inline_keyboard: [
        [
          {text: '➖', callback_data: JSON.stringify({id: callback.id, count: callback.count - 1})},
          {text: callback.count, callback_data: ' '},
          {text: '➕', callback_data: JSON.stringify({id: callback.id, count: callback.count + 1})}
        ],
        [{text: res.translate.save, callback_data: JSON.stringify({save: callback.id, count: callback.count})}],
        [{text: res.translate.back, callback_data: 'action change count'}],
      ]
    }, {chat_id: chatId, message_id: query.message.message_id})
  })
}

const save_count = async (query, user_data, chatId) => {
  let res = translation_assistant(user_data.language)
  bot.answerCallbackQuery(query.id, {text: res.translate.count_change_success, show_alert: true})

  bot.answerCallbackQuery(query.id).then(async () => {
    const callback = JSON.parse(query.data)
    let cart = await Cart.findOne({user: user_data._id})
    let index = cart.products.findIndex(val => val._id.toString() === callback.save)
    cart.products[index].count = callback.count

    await Cart.findByIdAndUpdate(cart._id, {products: cart.products})
    change_count_action(query, user_data, chatId)
  })
}

const action_delete_item = async (query, user_data, chatId) => {
  bot.answerCallbackQuery(query.id).then(async () => {
    let cart = await Cart.findOne({user: user_data._id})
    .populate({path: 'products.product', select: 'title title_uz price'}).lean()
    let products = actions_products(cart.products, user_data.language, 'delete item')
    let res = translation_assistant(user_data.language)

    let sliced_val = sliceIntoChunks(products.array, 1)
    sliced_val.push([{text: res.translate.back, callback_data: 'change items'}])

    bot.editMessageText(`${res.translate.delete_items}\n\n${products.list}`, {
      chat_id: chatId,
      message_id: query.message.message_id,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: sliced_val
      }
    })
  })
}

const delete_item = async (query, user_data, chatId) => {
  let res = translation_assistant(user_data.language)
  bot.answerCallbackQuery(query.id, {text: res.translate.deleted_message, show_alert: true}).then(async () => {
    const callback = JSON.parse(query.data)
    let cart = await Cart.findOne({user: user_data._id})
    .populate({path: 'products.product', select: 'title title_uz price'}).lean()
    
    let new_products_arr = cart.products.filter(val => val._id.toString() !== callback.delete)
    await Cart.findByIdAndUpdate(cart._id, {products: new_products_arr})

    if (new_products_arr.length === 0) {
      return bot.sendMessage(chatId, res.translate.empty_cart, {
        reply_markup: {
          keyboard: res.kb
        }
      })
    }

    let products = actions_products(new_products_arr, user_data.language, 'delete item')
    let sliced_val = sliceIntoChunks(products.array, 1)
    sliced_val.push([{text: res.translate.back, callback_data: 'change items'}])

    bot.editMessageText(`${res.translate.delete_items}\n\n${products.list}`, {
      chat_id: chatId,
      message_id: query.message.message_id,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: sliced_val
      }
    })
  })
}

const order = async (query, user_data, chatId) => {
  bot.answerCallbackQuery(query.id).then(async () => {
    let res = translation_assistant(user_data.language)

    if (!user_data.phone) {
      await User.findByIdAndUpdate(user_data._id, {action: 'request contact'})
      return bot.sendMessage(chatId, res.translate.request_contact, {
        reply_markup: {
          keyboard: [
            [{text: res.translate.send_contact, request_contact: true}]
          ],
          resize_keyboard: true
        }
      })
    }

    const cart = await Cart.findOne({user: user_data._id})
    const cart_count = await Order.find().count()
    const date = new Date()
    let year = date.getFullYear()

    const new_order = new Order({user: user_data._id, products: cart.products, order_num: `${year}${cart_count + 1}`, status: 0}) // date, 
    await new_order.save()
    await Cart.findByIdAndUpdate(cart._id, {products: []})
    // await User.findByIdAndUpdate(user_data._id, {action: `comment-${order._id}`})
    
    bot.sendMessage(chatId, `${res.translate.order_success}\n${res.translate.order_accepted} <b>${new_order.order_num}</b>`, {
      parse_mode: 'HTML',
      reply_markup: {
        keyboard: res.kb,
        resize_keyboard: true
      }
    })
    
    let order = await Order.findById(new_order._id)
    .populate([{path: 'products.product'}, {path: 'user'}])
    .lean()
    order.total_price = 0
    order.total_count = 0
    order.products = order.products.map(val => {
      val.total = val.count * val.product.price
      order.total_count += val.count
      order.total_price += val.total
      return val
    })
    io.emit('new order', order)
    
    let products = cart_products(order.products, 'ru')
    let text = `<i>Заказ!</i> 🛍\n\nИмя пользователя: <b>${order.user.name}</b>\nНомер телефона: <b><u>${order.user.phone}</u></b>\nНомер заказа: <b>${new_order.order_num}</b>\n\n${products}`
    bot.sendMessage(groupId, text, {
      parse_mode: 'HTML'
    })
  })
}




module.exports = {
  cart_items,
  clear_cart,
  change_cart_item,
  change_count_action,
  change_product_count,
  calculate_count,
  save_count,
  action_delete_item,
  delete_item,
  order
}