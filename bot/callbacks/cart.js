const {
  bot,
  sliceIntoChunks
} = require('../bot')

const cart_items = async (user_data, chatId) => {
  bot.sendMessage(chatId, 'cart')
}


module.exports = {
  cart_items
}