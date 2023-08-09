const User = require('../../models/users')
const Cart = require('../../models/cart')
const { bot } = require("../bot")
const { translation_assistant, cart_products, get_random_int } = require('../options/helpers')
const Review = require('../../models/review')
const Order = require('../../models/order')
const { io } = require('../..')


const start = async (msg, chatId) => {
  const name = msg.chat.first_name
  const user = await User.findOne({userId: chatId})

  if (!user) {
    const new_user = new User({
      userId: chatId,
      name: name,
      username: msg.chat.username
    })
    await new_user.save()
  } else {
    await User.findByIdAndUpdate(user._id, {action: ''})
  }

  bot.sendMessage(chatId, `Здравствуйте ${name}, выберите язык.\nAsslamu alaykum ${name}, tilni tanlang.`, {
    reply_markup: {
      keyboard: [
        ['Русский 🇷🇺', "O'zbek 🇺🇿"]
      ],
      resize_keyboard: true
    }
  })
}

const user_language = async (user_data, chatId, text) => {
  let language = text === 'Русский 🇷🇺' ? 'ru' : 'uz'
  await User.findByIdAndUpdate(user_data._id, {language})

  let res = translation_assistant(language)
  bot.sendMessage(chatId, res.translate.choose_interests_you, {
    reply_markup: {
      keyboard: res.kb,
      resize_keyboard: true
    }
  })
}

const contacts = async (user_data, chatId) => {
  let res = translation_assistant(user_data.language)
  bot.sendMessage(chatId, res.translate.contact_with_us, {
    reply_markup: {
      keyboard: res.kb,
      resize_keyboard: true
    },
    parse_mode: 'HTML'
  })
}

const leave_feedback = async (user_data, chatId) => {
  await User.findByIdAndUpdate(user_data._id, {action: 'grade'})
  let res = translation_assistant(user_data.language)
  bot.sendMessage(chatId, `${user_data.name} ${res.translate.rate_our_work}`, {
    reply_markup: {
      inline_keyboard: [
        [
          {text: '1 🌟', callback_data: JSON.stringify({grade: 1})},
          {text: '2 🌟', callback_data: JSON.stringify({grade: 2})},
          {text: '3 🌟', callback_data: JSON.stringify({grade: 3})},
          {text: '4 🌟', callback_data: JSON.stringify({grade: 4})},
          {text: '5 🌟', callback_data: JSON.stringify({grade: 5})},
        ],
        [
          {text: res.translate.back, callback_data: res.translate.back}
        ]
      ]
    }
  })
}

const review = async (user_data, text, commands, chatId) => {
  let res = translation_assistant(user_data.language)
  if (commands.includes(text) === true) {
    bot.sendMessage(chatId, res.translate.not_write_review, {
      parse_mode: 'HTML'
    })
    return
  }

  const review = await Review.findOne({user: user_data._id, status: 0})
  await Review.findByIdAndUpdate(review._id, {text: text, status: 1})
  await User.findByIdAndUpdate(user_data._id, {action: ''})
  bot.sendMessage(chatId, res.translate.choose_interests_you, {
    reply_markup: {
      keyboard: res.kb,
      resize_keyboard: true
    }
  })
}
const cart = async (user_data, chatId) => {
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
}

const settings = async (chatId) => {
  bot.sendMessage(chatId, "Выберите язык.\nTilni tanlang.", {
    reply_markup: {
      keyboard: [
        ['Русский 🇷🇺', "O'zbek 🇺🇿"]
      ],
      resize_keyboard: true
    }
  })
}

const main_menu = async (user_data, chatId) => {
  await User.findByIdAndUpdate(user_data._id, {action: ''})
  let res = translation_assistant(user_data.language)

  bot.sendMessage(chatId, res.translate.choose_interests_you, {
    reply_markup: {
      keyboard: res.kb,
      resize_keyboard: true
    }
  })
}

const get_contact = async (msg, user_data, chatId) => {
  let res = translation_assistant(user_data.language)
  await User.findByIdAndUpdate(user_data._id, {phone: msg.contact.phone_number || msg.text, action: ''})

  const cart = await Cart.findOne({user: user_data._id})
  const cart_count = await Order.find().count()
  const date = new Date()
  let year = date.getFullYear()
  // let dateee = '2022-04-09T17:05:44.514Z'

  const new_order = new Order({user: user_data._id, products: cart.products, date, order_num: `${year}${cart_count + 1}`, status: 0})
  await new_order.save()
  // await Cart.findByIdAndUpdate(cart._id, {products: []})
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
  let text = `<i>Заказ!</i> 🛍\n\nИмя пользователя: <b>${order.user.name}</b>\nНомер телефона: <b><u>+${order.user.phone}</u></b>\nНомер заказа: <b>${new_order.order_num}</b>\n\n${products}`
  bot.sendMessage(groupId, text, {
    parse_mode: 'HTML'
  })
}


module.exports = {
  start,
  user_language,
  contacts,
  leave_feedback,
  review,
  settings,
  cart,
  main_menu,
  get_contact
}