const Food = require('../../models/food')
const axios = require('axios')
const { translation_assistant, card } = require('../options/helpers')
const {
  bot,
} = require('../bot')

const category_card_products = async (query, user_data, category) => {
  const page = parseInt(query.offset) || 0
  const limit = 15
  const offset = page * limit
  let product = await Food.find({category: category._id})
  .sort({_id: -1})
  // .skip(offset)
  // .limit(limit)
  let result = product.map(val => {
    let weight_type = user_data.language === 'ru' ? val.weight_type : val.weight_type === 'гр.' ? 'gr.' : 'kg.'
    let weight = `${val.weight} ${weight_type}`
    let price_str = user_data.language === 'ru' ? 'сум' : 'sum'
    return {
      type: 'article',
      id: val.id,
      title: user_data.language === 'ru' ? val.title : val.title_uz,
      input_message_content: {
        message_text: `product-${val.id}`,
      },
      description: `${weight}\n${val.price.toLocaleString('fr')} ${price_str}`,
      thumbnail_url: 'https://images4.alphacoders.com/655/655929.png'
    }
  })

  const next = page + 1
  bot.answerInlineQuery(query.id, result, 
    // {
    // next_offset: next.toString(),
    // cache_time: 0
    // }
  )
}


module.exports = {
  category_card_products
}