const {bot, advertisingGroupId} = require('../bot')
const Users = require('../../models/users')
const batch_size = 2
let offset = 0
let is_sending = false

const get_advertising = async (msg) => {
  send_message_to_users({ groupId: advertisingGroupId, messageId: msg.message_id, text: msg.text });
};

const send_message_to_users = async (data) => {
  if (is_sending) return;

  try {
    let users = await Users.find()
    .skip(offset)
    .limit(batch_size);

    users.forEach(val => {
      const chatId = val.userId;
      send_message(chatId, data);
    });
    offset += batch_size;

    if (offset >= await Users.countDocuments()) {
      offset = 0;
      is_sending = false
      console.log('Рассылка закончена!');
    } else {
      setTimeout(() => {
        send_message_to_users(data);
      }, 2000);
    }
  } catch (err) {
    console.error('Ошибка при получении пользователей из базы данных:', err);
    is_sending = false;
  }
};

const send_message = (chatId, data) => {
  bot.forwardMessage(chatId, data.groupId, data.messageId)
  .catch((error) => {
    if (error.response && error.response.statusCode === 403) {
      console.log(`Пользователь с ID ${chatId} заблокировал бота.`);
    } else {
      console.error(`Ошибка при отправке сообщения пользователю с ID ${chatId}:`, error);
    }
  });
};


module.exports = {
  get_advertising
}