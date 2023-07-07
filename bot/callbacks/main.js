const { bot } = require('../bot')
const User = require('../../models/users')
const Review = require('../../models/review')


const callback_grade = async (query, user_data, chatId) => {
  const messageId = query.message.message_id
  const callback = JSON.parse(query.data)
  await User.findByIdAndUpdate(user_data._id, {action: 'review'})
  const new_reviw = new Review({grade: callback.grade, user: user_data._id})
  await new_reviw.save()

  const title = user_data.language === 'ru' ? `Вы поставили ${callback.grade} 🌟` : `Siz ${callback.grade} 🌟 berdingiz`
  const text = user_data.language === 'ru' ? 'Теперь напиши свой отзыв.' : 'Endi sharhlaringizni yozing.'
  bot.editMessageText(`${title}\n<b><u>${text}</u></b>`, {
    chat_id: chatId,
    message_id: messageId,
    parse_mode: 'HTML'
  })
}


module.exports = {
  callback_grade
}