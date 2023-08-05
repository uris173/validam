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
  let order_num = get_random_int()
  let find_order_num = await Cart.findOne({order_num})
  while (find_order_num) {
    order = get_random_int()
    find_order_num = await Cart.findOne({order_num})
  }
  const order = new Order({user: user_data._id, products: cart.products, date: Date.now(), order_num, status: 0})
  await order.save()
  // await Cart.findByIdAndUpdate(cart._id, {products: []})
  // await User.findByIdAndUpdate(user_data._id, {action: `comment-${order._id}`})
  io.emit('new order', order)
  
  bot.sendMessage(chatId, `${res.translate.order_success}\n${res.translate.order_accepted} <b>${order_num}</b>`, {
    parse_mode: 'HTML',
    reply_markup: {
      keyboard: res.kb,
      resize_keyboard: true
    }
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