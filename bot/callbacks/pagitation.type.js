const Food = require('../../models/food')
const url = 'http://localhost:3000'
const axios = require('axios')
const { translation_assistant, card } = require('../options/helpers')
const {
  bot,
  sliceIntoChunks
} = require('../bot')

const pagintation_callback_category = async (query, user_data, chatId) => {
  const callback = JSON.parse(query.data)

  let response = await axios.get(`${url}/api/category/${callback.category}`)
  if (response.status === 200) {
    let food = response.data.food
    let page = response.data.page

    let res = translation_assistant(user_data.language)
    if (food.length === 0) {
      bot.answerCallbackQuery(query.id, {text: res.translate.empty_food, show_alert: true})
    } else {
      bot.answerCallbackQuery((query.id)).then(async () => {
        let list = ''
        food.forEach((val, index) => {
          let title = user_data.language === 'ru' ? val.title : val.title_uz
          let weight = `${val.weight} ${val.weight_type}`
          let price_str = user_data.language === 'ru' ? 'сум' : 'sum'
          list += `<i>${index + 1}</i>) <b>${title}</b>. ${weight} - ${val.price.toLocaleString('fr')} ${price_str}\n`
        })
        
        let array = []
        food.forEach((val, index) => {
          let obj = {}
          obj.text = index + 1
          obj.callback_data = JSON.stringify({food: val._id, next: page})
          array.push(obj)
        })

        let sliced_val = sliceIntoChunks(array, 5)
        let pagination = {
          pagination_btn: [
            {text: '⬅️', callback_data: JSON.stringify({next: 0, category: callback.category})},
            {text: `${page + 1}`, callback_data: ` `},
            {text: '➡️', callback_data: JSON.stringify({next: page + 1, category: callback.category})}
          ],
          back_btn: [
            {text: res.translate.back, callback_data: 'back to category'}
          ]
        }

        sliced_val.push(pagination.pagination_btn, pagination.back_btn)
        bot.editMessageText(list, {
          message_id: query.message.message_id,
          chat_id: chatId,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: sliced_val
          }
        }).catch(error => {
          let err_msg = 'Bad Request: message is not modified: specified new message content and reply markup are exactly the same as a current content and reply markup of the message'
          if (error.response.body.description === err_msg) {
            bot.answerCallbackQuery(query.id, {text: language.back_answer, show_alert: true})
          }
        })
      })
    }
  }
}

const callback_next = async (query, user_data, chatId) => {
  const callback = JSON.parse(query.data)
  let response = await axios.get(`${url}/api/category/${callback.category}?page=${callback.next}`)
  if (response.status === 200) {
    let food = response.data.food
    let res = translation_assistant(user_data.language)

    if (food.length === 0) {
      bot.answerCallbackQuery(query.id, {text: res.translate.back_answer, show_alert: true})
    } else {
      bot.answerCallbackQuery((query.id)).then(() => {
        let list = ''
        food.forEach((val, index) => {
          let title = user_data.language === 'ru' ? val.title : val.title_uz
          let weight = `${val.weight} ${val.weight_type}`
          let price_str = user_data.language === 'ru' ? 'сум' : 'sum'
          list += `<i>${index + 1}</i>) <b>${title}</b>. ${weight} - ${val.price.toLocaleString('fr')} ${price_str}\n`
        })

        let array = []
        food.forEach((val, index) => {
          let obj = {}
          obj.text = index + 1
          obj.callback_data = JSON.stringify({food: val._id, next: callback.next})
          array.push(obj)
        })

        let sliced_val = sliceIntoChunks(array, 5)
        let pagination = {
          pagination_btn: [
            {text: '⬅️', callback_data: JSON.stringify({next: callback.next === 0 ? callback.next = 0 : callback.next - 1, category: callback.category})},
            {text: `${callback.next === 0 ? 1 : callback.next + 1}`, callback_data: ' '},
            {text: '➡️', callback_data: JSON.stringify({next: callback.next + 1, category: callback.category})}
          ],
          back_btn: [
            {text: res.translate.back, callback_data: 'back to category'}
          ]
        }

        sliced_val.push(pagination.pagination_btn, pagination.back_btn)
        bot.editMessageText(list, {
          message_id: query.message.message_id,
          chat_id: chatId,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: sliced_val
          }
        }).catch(err => {
          return false
        })
      })
    }
  }
}

const pagination_callback_food = async (query, user_data, chatId) => {
  bot.answerCallbackQuery((query.id)).then(async () => {
    const callback = JSON.parse(query.data)
    let food = await Food.findById(callback.food)
    let food_card = card(food, user_data.language)
    bot.deleteMessage(chatId, query.message.message_id)
    let res = translation_assistant(user_data.language)

    let count = 1
    bot.sendPhoto(chatId, food_card.img, {
      parse_mode: 'HTML',
      caption: food_card.info,
      reply_markup: {
        inline_keyboard: [
          [
            {text: '➖', callback_data: JSON.stringify({decrease: food._id, count: count, next: callback.next})},
            {text: count, callback_data: ' '},
            {text: '➕', callback_data: JSON.stringify({increase: food._id, count: count, next: callback.next})}
          ],
          [
            {text: res.translate.back, callback_data: JSON.stringify({category: food.category, next: callback.next})},
            {text: res.translate.to_cart, callback_data: JSON.stringify({to_cart: food._id, count})}
          ],
          [{text: res.translate.go_to_cart, callback_data: 'go to cart'}]
        ]
      }
    })
  })
}


module.exports = {
  pagintation_callback_category,
  callback_next,
  pagination_callback_food
}