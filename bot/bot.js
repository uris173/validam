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

module.exports = {
  bot,
  sliceIntoChunks,
  commands
}


require('./branches/on.message')
require('./branches/callback')