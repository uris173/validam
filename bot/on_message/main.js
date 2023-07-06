const User = require('../../models/users')
const { bot } = require("../bot")
const { translation_assistant } = require('../options/helpers')
// const { menu_kb_ru, menu_kb_uz } = require('../options/keyboards')


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

  const user = User.findById(user_data._id)
  let res = translation_assistant(user.language)

  bot.sendMessage(chatId, res.translate.choose_interests_you, {
    reply_markup: {
      keyboard: res.kb,
      resize_keyboard: true
    }
  })
}


module.exports = {
  start,
  user_language
}