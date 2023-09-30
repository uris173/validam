const Telegram_Bot = require('node-telegram-bot-api')
const TOKEN = '6071187964:AAHAUYP1Han-lxt2MZ6Bav2y94Mp-WLMw9g'
// food-bot - 6326200881:AAHgE9F4BRy3O2lBPpgYEnmlRlPgQkBZCiY
// test-nginx-bot - 6071187964:AAHAUYP1Han-lxt2MZ6Bav2y94Mp-WLMw9g

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
const advertisingGroupId = -1001980301491

module.exports = {
  bot,
  sliceIntoChunks,
  commands,
  url,
  groupId,
  advertisingGroupId,
}


require('./branches/on.message')
require('./branches/callback')
require('./branches/inline.query')