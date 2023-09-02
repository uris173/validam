const Users = require('../models/users')

const all_users = async (req, res) => {
  const count = await Users.find().count()
  const users = await Users.find().sort({_id: -1})
  res.status(200).json({users, count})
}

const sms_sending = async (req, res) => {
  let {title, link_text, text, img, link} = req.body
  let message = `<b>${title}</b>\n\n${text}\n\n\n<a href="${link}">${link_text}</a>`
  start_sending({img, message})
  res.status(200).json({message: 'Реклама рассылается.'})
}

const start_sending = (data) => {
  send_message_to_users(data)
  setInterval(() => {
    send_message_to_users(data)
  }, 2000)
}

const send_message_to_users = async (data) => {
  if (is_sending) return

  is_sending = true
  try {
    let users = await Users.find()
        .skip(offset)
        .limit(batch_size)

    users.forEach(val => {
      const chatId = val.userId
      send_message(chatId, data)
    })
    offset += 1

    if (offset >= Users.countDocuments()) {
      offset = 0
    }
  } catch (err) {
    console.error('Ошибка при получении пользователей из базы данных:', err)
  } finally {
    is_sending = true
  }
}

const send_message = (chatId, data) => {
  if (data.img) {
    let img = `${url}/${data.img}`
    bot.sendPhoto(chatId, img, {
      parse_mode: 'HTML',
      caption: data.message
    }).catch(error => {
      if (error.response && error.response.statusCode === 403) {
        console.log(`Пользователь с ID ${chatId} заблокировал бота.`)
      } else {
        console.error(`Ошибка при отправке сообщения пользователю с ID ${chatId}:`);
      }
    })
  } else {
    bot.sendMessage(chatId, data.text, {
      parse_mode: 'HTML'
    }).catch(error => {
      if (error.response && error.response.statusCode === 403) {
        console.log(`Пользователь с ID ${chatId} заблокировал бота.`)
      } else {
        console.error(`Ошибка при отправке сообщения пользователю с ID ${chatId}:`);
      }
    })
  }
}


module.exports = {
  all_users,
  sms_sending
}