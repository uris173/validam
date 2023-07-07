const User = require('../../models/users')
const { bot } = require("../bot")
const { translation_assistant } = require('../options/helpers')
const Review = require('../../models/review')


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


module.exports = {
  start,
  user_language,
  contacts,
  leave_feedback,
  review
}