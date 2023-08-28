const Telegram_Bot = require('node-telegram-bot-api')
const TOKEN = '6326200881:AAHgE9F4BRy3O2lBPpgYEnmlRlPgQkBZCiY'

const bot = new Telegram_Bot(TOKEN, {
  polling: true
})

function sliceIntoChunks(arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}
const commands = ['/start', 'Меню 📋', 'Контакты 📞', 'Оставить отзыв ✍️', 'Корзина 🧺', 'Настройки ⚙️', "Menyu 📋", "Kontaktlar 📞", "Fikr qoldiring ✍️", "Savat 🧺", "Sozlamalar ⚙️"]
// const url = 'http://localhost:3004'
const url = 'https://foodapi.of-astora.uz'
const groupId = -1001921927445

module.exports = {
  bot,
  sliceIntoChunks,
  commands,
  url,
  groupId
}


require('./branches/on.message')
require('./branches/callback')
require('./branches/inline.query')